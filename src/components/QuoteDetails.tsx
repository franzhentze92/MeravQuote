import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import QuoteLineItem, { LineItem } from './QuoteLineItem';

interface QuoteDetailsProps {
  onQuoteChange: (items: LineItem[], totals: any) => void;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ onQuoteChange }) => {
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      type: '',
      name: '',
      quantity: 1,
      unit: '',
      unitPrice: 0,
      tax: 0
    };
    const updated = [...lineItems, newItem];
    setLineItems(updated);
    updateTotals(updated);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updated = lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setLineItems(updated);
    updateTotals(updated);
  };

  const deleteLineItem = (id: string) => {
    const updated = lineItems.filter(item => item.id !== id);
    setLineItems(updated);
    updateTotals(updated);
  };

  const updateTotals = (items: LineItem[]) => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    const totalTax = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + (itemSubtotal * (item.tax / 100));
    }, 0);
    
    const total = subtotal + totalTax;
    
    const totals = {
      subtotal,
      tax: totalTax,
      total
    };
    
    onQuoteChange(items, totals);
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTax = lineItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + (itemSubtotal * (item.tax / 100));
  }, 0);
  const total = subtotal + totalTax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Quote Details
          <Button onClick={addLineItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lineItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No items added yet. Click "Add Item" to start building your quote.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {lineItems.map(item => (
                <QuoteLineItem
                  key={item.id}
                  item={item}
                  onUpdate={updateLineItem}
                  onDelete={deleteLineItem}
                />
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-end space-y-2">
                <div className="text-right space-y-1">
                  <div>Subtotal: ${subtotal.toFixed(2)}</div>
                  <div>Tax: ${totalTax.toFixed(2)}</div>
                  <div className="font-bold text-lg">Total: ${total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteDetails;