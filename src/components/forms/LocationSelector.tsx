
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface LocationSelectorProps {
  onLocationChange: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <Select onValueChange={onLocationChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Main School">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Main School
            </div>
          </SelectItem>
          <SelectItem value="Hostel">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Hostel
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
