
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertTriangle, Award } from 'lucide-react';
import IncidentForm from '@/components/forms/IncidentForm';
import MeritForm from '@/components/forms/MeritForm';

const QuickActionCards: React.FC = () => {
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [meritDialogOpen, setMeritDialogOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Dialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mcc-red">
                  <AlertTriangle className="h-5 w-5" />
                  Log New Incident
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Record disciplinary incidents and assign sanctions</p>
                <Button className="w-full bg-mcc-red hover:bg-red-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Record Incident
                </Button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Incident</DialogTitle>
            </DialogHeader>
            <IncidentForm />
          </DialogContent>
        </Dialog>

        <Dialog open={meritDialogOpen} onOpenChange={setMeritDialogOpen}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-mcc-green">
                  <Award className="h-5 w-5" />
                  Award Merit Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Recognize positive behavior and academic excellence</p>
                <Button className="w-full bg-mcc-green hover:bg-green-600">
                  <Award className="mr-2 h-4 w-4" />
                  Give Merit
                </Button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Award Merit Points</DialogTitle>
            </DialogHeader>
            <MeritForm />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default QuickActionCards;
