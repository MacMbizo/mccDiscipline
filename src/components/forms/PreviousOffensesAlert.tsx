
import React from 'react';
import { Info } from 'lucide-react';

interface PreviousOffensesAlertProps {
  previousOffenses: any[];
  suggestedOffenseLevel: number;
}

const PreviousOffensesAlert: React.FC<PreviousOffensesAlertProps> = ({
  previousOffenses,
  suggestedOffenseLevel,
}) => {
  if (previousOffenses.length === 0) return null;

  return (
    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-amber-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-800">Previous Offenses Found</p>
          <p className="text-amber-700">
            This student has {previousOffenses.length} previous offense(s) for this misdemeanor.
            Suggested offense level: {suggestedOffenseLevel}
          </p>
          <div className="mt-2 space-y-1">
            {previousOffenses.slice(-3).map((offense, index) => (
              <div key={offense.id} className="text-xs text-amber-600">
                {offense.offense_number} offense: {new Date(offense.created_at).toLocaleDateString()} - {offense.sanction}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousOffensesAlert;
