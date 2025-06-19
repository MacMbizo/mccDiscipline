
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Misdemeanor } from '@/hooks/useMisdemeanors';

interface MisdemeanorSelectorProps {
  misdemeanors: Misdemeanor[];
  selectedMisdemeanor: string;
  onMisdemeanorChange: (misdemeanorId: string) => void;
}

const MisdemeanorSelector: React.FC<MisdemeanorSelectorProps> = ({
  misdemeanors,
  selectedMisdemeanor,
  onMisdemeanorChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="misdemeanor">Misdemeanor Type</Label>
      <Select value={selectedMisdemeanor} onValueChange={onMisdemeanorChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select misdemeanor type" />
        </SelectTrigger>
        <SelectContent>
          {misdemeanors.map((misdemeanor) => (
            <SelectItem key={misdemeanor.id} value={misdemeanor.id}>
              <div>
                <div className="font-medium">{misdemeanor.name}</div>
                <div className="text-sm text-gray-500">{misdemeanor.location}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MisdemeanorSelector;
