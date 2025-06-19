
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Misdemeanor } from '@/hooks/useMisdemeanors';

interface SanctionFieldProps {
  value: string;
  onChange: (value: string) => void;
  autoSanction: string;
  selectedMisdemeanorData?: Misdemeanor;
  selectedOffenseNumber: number;
  error?: string;
}

const SanctionField: React.FC<SanctionFieldProps> = ({
  value,
  onChange,
  autoSanction,
  selectedMisdemeanorData,
  selectedOffenseNumber,
  error,
}) => {
  const getOffenseKey = (offenseNumber: number): string => {
    switch (offenseNumber) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return '4th+';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="sanction">Sanction</Label>
      <Textarea
        placeholder="Sanction will be automatically populated"
        className="min-h-20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {autoSanction && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm font-medium text-blue-800">Auto-populated Sanction:</p>
          <p className="text-sm text-blue-700">{autoSanction}</p>
          <p className="text-xs text-blue-600 mt-1">
            You can edit this sanction if needed, but the system has applied the standard sanction for this offense level.
          </p>
        </div>
      )}
      {selectedMisdemeanorData?.sanctions && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm font-medium text-gray-800 mb-2">Available sanctions for this misdemeanor:</p>
          <div className="text-sm text-gray-700 space-y-1">
            {Object.entries(selectedMisdemeanorData.sanctions as Record<string, string>).map(([offense, sanction]) => {
              const currentOffenseKey = getOffenseKey(selectedOffenseNumber);
              const isCurrentOffense = offense === currentOffenseKey;
              
              return (
                <div key={offense} className={isCurrentOffense ? 'font-medium text-blue-700' : ''}>
                  <strong>{offense}:</strong> {sanction}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SanctionField;
