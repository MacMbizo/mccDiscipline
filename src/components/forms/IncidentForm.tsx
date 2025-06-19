
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useStudents } from '@/hooks/useStudents';
import { useMisdemeanors } from '@/hooks/useMisdemeanors';
import { useBehaviorRecords, useCreateBehaviorRecord } from '@/hooks/useBehaviorRecords';
import { useAuth } from '@/contexts/AuthContext';
import StudentSelector from './StudentSelector';
import LocationSelector from './LocationSelector';
import MisdemeanorSelector from './MisdemeanorSelector';
import PreviousOffensesAlert from './PreviousOffensesAlert';
import OffenseNumberSelector from './OffenseNumberSelector';
import SanctionField from './SanctionField';

interface IncidentFormData {
  student_id: string;
  location: string;
  misdemeanor_id: string;
  offense_number: number;
  sanction: string;
  description: string;
}

const IncidentForm: React.FC = () => {
  const { user } = useAuth();
  const { data: students = [] } = useStudents();
  const { data: misdemeanors = [] } = useMisdemeanors();
  const createBehaviorRecord = useCreateBehaviorRecord();

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedMisdemeanor, setSelectedMisdemeanor] = useState('');
  const [selectedOffenseNumber, setSelectedOffenseNumber] = useState(1);
  const [sanction, setSanction] = useState('');
  const [description, setDescription] = useState('');
  const [previousOffenses, setPreviousOffenses] = useState<any[]>([]);
  const [suggestedOffenseLevel, setSuggestedOffenseLevel] = useState(1);

  const { data: behaviorRecords = [] } = useBehaviorRecords(selectedStudent);

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncidentFormData>();

  // Filter misdemeanors based on selected location
  const filteredMisdemeanors = misdemeanors.filter(
    (misdemeanor) => !selectedLocation || misdemeanor.location === selectedLocation
  );

  // Find selected misdemeanor data
  const selectedMisdemeanorData = misdemeanors.find(
    (m) => m.id === selectedMisdemeanor
  );

  // Update previous offenses when student or misdemeanor changes
  useEffect(() => {
    if (selectedStudent && selectedMisdemeanor && behaviorRecords) {
      const studentOffenses = behaviorRecords.filter(
        (record: any) => 
          record.student_id === selectedStudent && 
          record.misdemeanor_id === selectedMisdemeanor &&
          record.type === 'incident'
      );
      
      setPreviousOffenses(studentOffenses);
      setSuggestedOffenseLevel(studentOffenses.length + 1);
      setSelectedOffenseNumber(studentOffenses.length + 1);
    } else {
      setPreviousOffenses([]);
      setSuggestedOffenseLevel(1);
      setSelectedOffenseNumber(1);
    }
  }, [selectedStudent, selectedMisdemeanor, behaviorRecords]);

  // Auto-populate sanction when misdemeanor and offense number change
  useEffect(() => {
    if (selectedMisdemeanorData?.sanctions && selectedOffenseNumber) {
      const offenseKey = selectedOffenseNumber === 1 ? '1st' : 
                        selectedOffenseNumber === 2 ? '2nd' : 
                        selectedOffenseNumber === 3 ? '3rd' : '4th+';
      
      const sanctions = selectedMisdemeanorData.sanctions as Record<string, string>;
      const autoSanction = sanctions[offenseKey] || sanctions['1st'] || '';
      setSanction(autoSanction);
    }
  }, [selectedMisdemeanorData, selectedOffenseNumber]);

  const onSubmit = async () => {
    if (!selectedStudent || !selectedLocation || !selectedMisdemeanor || !sanction) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createBehaviorRecord.mutateAsync({
        student_id: selectedStudent,
        type: 'incident',
        location: selectedLocation,
        misdemeanor_id: selectedMisdemeanor,
        offense_number: selectedOffenseNumber,
        sanction,
        description,
        status: 'open',
        reported_by: user?.id,
        timestamp: new Date().toISOString(),
      });

      toast.success('Incident logged successfully');
      
      // Reset form
      setSelectedStudent('');
      setSelectedLocation('');
      setSelectedMisdemeanor('');
      setSelectedOffenseNumber(1);
      setSanction('');
      setDescription('');
      reset();
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Failed to log incident');
    }
  };

  const autoSanction = selectedMisdemeanorData?.sanctions && selectedOffenseNumber
    ? (selectedMisdemeanorData.sanctions as Record<string, string>)[
        selectedOffenseNumber === 1 ? '1st' : 
        selectedOffenseNumber === 2 ? '2nd' : 
        selectedOffenseNumber === 3 ? '3rd' : '4th+'
      ] || ''
    : '';

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Log New Incident</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <StudentSelector
            students={students}
            selectedStudent={selectedStudent}
            onStudentChange={setSelectedStudent}
            error={errors.student_id?.message}
          />

          <LocationSelector onLocationChange={setSelectedLocation} />

          <MisdemeanorSelector
            misdemeanors={filteredMisdemeanors}
            selectedMisdemeanor={selectedMisdemeanor}
            onMisdemeanorChange={setSelectedMisdemeanor}
          />

          <PreviousOffensesAlert
            previousOffenses={previousOffenses}
            suggestedOffenseLevel={suggestedOffenseLevel}
          />

          <OffenseNumberSelector
            selectedOffenseNumber={selectedOffenseNumber}
            suggestedOffenseLevel={suggestedOffenseLevel}
            onOffenseNumberChange={(value) => setSelectedOffenseNumber(parseInt(value))}
          />

          <SanctionField
            value={sanction}
            onChange={setSanction}
            autoSanction={autoSanction}
            selectedMisdemeanorData={selectedMisdemeanorData}
            selectedOffenseNumber={selectedOffenseNumber}
            error={errors.sanction?.message}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Describe the incident in detail..."
              className="min-h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createBehaviorRecord.isPending}
              className="flex-1"
            >
              {createBehaviorRecord.isPending ? 'Logging...' : 'Log Incident'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedStudent('');
                setSelectedLocation('');
                setSelectedMisdemeanor('');
                setSelectedOffenseNumber(1);
                setSanction('');
                setDescription('');
                reset();
              }}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncidentForm;
