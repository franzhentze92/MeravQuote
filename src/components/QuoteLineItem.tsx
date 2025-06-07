import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface LineItem {
  id: string;
  type: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tax: number;
}

interface QuoteLineItemProps {
  item: LineItem;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
  onDelete: (id: string) => void;
}

const QuoteLineItem: React.FC<QuoteLineItemProps> = ({ item, onUpdate, onDelete }) => {
  const subtotal = item.quantity * item.unitPrice;
  const taxAmount = subtotal * (item.tax / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-8 gap-2 p-4 border rounded-lg">
      <div>
        <Select onValueChange={(value) => onUpdate(item.id, 'type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="labor">Labor</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="permit">Permit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          placeholder="Item name"
          value={item.name}
          onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div>
        <Select onValueChange={(value) => onUpdate(item.id, 'unit', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m²">m²</SelectItem>
            <SelectItem value="ft²">ft²</SelectItem>
            <SelectItem value="hour">Hour</SelectItem>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="item">Item</SelectItem>
            <SelectItem value="lump">Lump Sum</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type="number"
          placeholder="Price"
          value={item.unitPrice}
          onChange={(e) => onUpdate(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="Tax %"
          value={item.tax}
          onChange={(e) => onUpdate(item.id, 'tax', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="text-right font-medium">
        ${total.toFixed(2)}
      </div>
      <div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuoteLineItem;