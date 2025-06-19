
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OffenseNumberSelectorProps {
  selectedOffenseNumber: number;
  suggestedOffenseLevel: number;
  onOffenseNumberChange: (value: string) => void;
}

const OffenseNumberSelector: React.FC<OffenseNumberSelectorProps> = ({
  selectedOffenseNumber,
  suggestedOffenseLevel,
  onOffenseNumberChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="offense_number">Offense Number</Label>
      <Select 
        value={selectedOffenseNumber.toString()}
        onValueChange={onOffenseNumberChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select offense number" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1st Offense</SelectItem>
          <SelectItem value="2">2nd Offense</SelectItem>
          <SelectItem value="3">3rd Offense</SelectItem>
          <SelectItem value="4">4th+ Offense</SelectItem>
        </SelectContent>
      </Select>
      {suggestedOffenseLevel > 1 && selectedOffenseNumber !== suggestedOffenseLevel && (
        <p className="text-sm text-amber-600">
          Recommended: {suggestedOffenseLevel} offense based on student's history
        </p>
      )}
    </div>
  );
};

export default OffenseNumberSelector;
