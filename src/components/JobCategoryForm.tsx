import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobCategoryFormProps {
  onCategoryChange: (category: string) => void;
}

const JobCategoryForm: React.FC<JobCategoryFormProps> = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Architecture Design',
    'Demolition',
    'New Construction',
    'Renovation / Remodel',
    'Electrical Work',
    'Plumbing',
    'Tiling / Flooring',
    'Painting',
    'Roofing',
    'Landscaping',
    'Structural Reinforcement',
    'Permits & Approvals'
  ];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="jobCategory">Select Job Category</Label>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose job category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCategoryForm;