
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  user_id: string;
  type: string;
  message: string;
  reference_id?: string;
  reference_type?: string;
  delivery_methods?: string[];
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      user_id,
      type,
      message,
      reference_id,
      reference_type,
      delivery_methods = ["push"]
    }: NotificationRequest = await req.json();

    // Create notification record
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id,
        type,
        message,
        reference_id,
        reference_type,
      })
      .select()
      .single();

    if (notificationError) {
      throw notificationError;
    }

    // Get user preferences
    const { data: profile } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("id", user_id)
      .single();

    const preferences = profile?.notification_preferences || {};

    // Process each delivery method
    for (const method of delivery_methods) {
      // Check if user has enabled this method for this type
      const prefKey = `${method}_${type}s`;
      if (preferences[prefKey] === false) {
        continue;
      }

      // Create delivery log entry
      const { error: logError } = await supabase
        .from("notification_delivery_log")
        .insert({
          notification_id: notification.id,
          delivery_method: method,
          delivery_status: "pending",
        });

      if (logError) {
        console.error("Failed to create delivery log:", logError);
      }

      // Handle different delivery methods
      switch (method) {
        case "email":
          await sendEmailNotification(notification, user_id);
          break;
        case "sms":
          await sendSMSNotification(notification, user_id);
          break;
        case "push":
          await sendPushNotification(notification, user_id);
          break;
      }
    }

    return new Response(
      JSON.stringify({ success: true, notification_id: notification.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendEmailNotification(notification: any, user_id: string) {
  // Implementation would use Resend or similar service
  console.log(`Sending email notification to user ${user_id}`);
  
  await updateDeliveryStatus(notification.id, "email", "sent");
}

async function sendSMSNotification(notification: any, user_id: string) {
  // Implementation would use Twilio or similar service
  console.log(`Sending SMS notification to user ${user_id}`);
  
  await updateDeliveryStatus(notification.id, "sms", "sent");
}

async function sendPushNotification(notification: any, user_id: string) {
  // Implementation would use push notification service
  console.log(`Sending push notification to user ${user_id}`);
  
  await updateDeliveryStatus(notification.id, "push", "sent");
}

async function updateDeliveryStatus(
  notification_id: string,
  method: string,
  status: string
) {
  await supabase
    .from("notification_delivery_log")
    .update({
      delivery_status: status,
      delivered_at: status === "sent" ? new Date().toISOString() : null,
    })
    .eq("notification_id", notification_id)
    .eq("delivery_method", method);
}

serve(handler);
