import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  propertyType: string;
}

interface ClientFormProps {
  onClientChange: (data: ClientData) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onClientChange }) => {
  const [client, setClient] = useState<ClientData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    propertyType: ''
  });

  const handleChange = (field: keyof ClientData, value: string) => {
    const updated = { ...client, [field]: value };
    setClient(updated);
    onClientChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input
            id="fullName"
            value={client.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Ingrese el nombre del cliente"
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={client.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Ingrese el número de teléfono"
          />
        </div>
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={client.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Ingrese el correo electrónico"
          />
        </div>
        <div>
          <Label htmlFor="address">Dirección del Proyecto</Label>
          <Input
            id="address"
            value={client.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Ingrese la dirección del proyecto"
          />
        </div>
        <div>
          <Label htmlFor="propertyType">Tipo de Propiedad</Label>
          <Select onValueChange={(value) => handleChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el tipo de propiedad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residencial">Residencial</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientForm;