import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Share } from 'lucide-react';
import ClientForm from './ClientForm';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import QuotePDF from './QuotePDF';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';

interface ClientData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  propertyType: string;
}

interface QuoteTotals {
  subtotal: number;
  tax: number;
  total: number;
}

// Data models for new quote format
interface HeaderFields {
  project: string;
  client: string;
  address: string;
  proposal: string;
  date: string;
}

interface Section {
  name: string;
  items: LineItem[];
}

interface SummaryFields {
  totalDirectCost: number;
  iva: number;
  total: number;
}

interface LineItem {
  id: string;
  type: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tax: number;
}

const DEFAULT_SECTIONS = [
  'OBRA CIVIL',
  'ELECTRICIDAD',
  'PLOMERÍA',
  'PISOS Y AZULEJOS',
  'HERRERIA',
  'TABLA YESO',
  'CARPINTERÍA',
  'VENTANERÍA',
  'ACABADOS',
  'MOBILIARIO',
  'VARIOS',
];

const QuoteBuilder: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    propertyType: ''
  });
  
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [totals, setTotals] = useState<QuoteTotals>({
    subtotal: 0,
    tax: 0,
    total: 0
  });

  // Header fields
  const [header, setHeader] = useState<HeaderFields>({
    project: '',
    client: '',
    address: '',
    proposal: '',
    date: '',
  });

  // Sections and line items
  const [sections, setSections] = useState<Section[]>(
    DEFAULT_SECTIONS.map((name) => ({ name, items: [] }))
  );

  // Summary
  const [summary, setSummary] = useState<SummaryFields>({
    totalDirectCost: 0,
    iva: 0,
    total: 0,
  });

  // Terms, payment info, footer
  const [terms, setTerms] = useState<string[]>([
    'No se incluye ningún otro servicio que no esté descrito en los renglones de esta cotización.',
    'En esta propuesta se presentan los costos directos de cada renglón, y se contempla cobrar un % de honorarios sobre la inversión por coordinación, supervisión y administración del proyecto.',
    'Se dará inicio a los trabajos al recibir el anticipo y aprobación por escrito por parte del cliente.',
    'Tiempo de entrega: 5 semanas',
  ]);
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'A Convenir',
    bankDetails: '',
  });
  const [footer, setFooter] = useState({
    phone: '(502)5551-3554',
    email: 'lpbarrios@aureagt.com',
    address: '4 avenida 19-90 zona 14, oficina 7, nivel 3.',
  });

  // Add timeline state and handlers
  const [timeline, setTimeline] = useState<{ date: string; description: string }[]>([]);
  const addTimelineEvent = () => setTimeline([...timeline, { date: '', description: '' }]);
  const updateTimelineEvent = (idx: number, field: 'date' | 'description', value: string) => {
    const updated = [...timeline];
    updated[idx][field] = value;
    setTimeline(updated);
  };
  const removeTimelineEvent = (idx: number) => setTimeline(timeline.filter((_, i) => i !== idx));

  const [showPDFLink, setShowPDFLink] = useState(false);

  // Add IVA percentage state
  const [ivaPercent, setIvaPercent] = useState(12);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailToSend, setEmailToSend] = useState('');
  const [sending, setSending] = useState(false);
  const pdfDocRef = useRef<any>(null);

  const handleClientChange = (data: ClientData) => {
    setClientData(data);
  };

  const handleQuoteChange = (items: LineItem[], quoteTotals: QuoteTotals) => {
    setLineItems(items);
    setTotals(quoteTotals);
  };

  // Placeholder PDF and share handlers
  const generatePDF = () => {
    setShowPDFLink(true);
  };
  const shareQuote = () => {
    alert('Share feature coming soon!');
  };

  // Handlers for header fields
  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  // Handlers for section and line items
  const handleLineItemChange = (sectionIdx: number, itemIdx: number, field: keyof LineItem, value: string | number) => {
    const updatedSections = [...sections];
    const item = { ...updatedSections[sectionIdx].items[itemIdx], [field]: value };
    updatedSections[sectionIdx].items[itemIdx] = item;
    setSections(updatedSections);
    recalculateSummary(updatedSections);
  };

  const addLineItem = (sectionIdx: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIdx].items.push({
      id: Date.now().toString() + Math.random(),
      type: '',
      name: '',
      quantity: 1,
      unit: '',
      unitPrice: 0,
      tax: 0,
    });
    setSections(updatedSections);
  };

  const removeLineItem = (sectionIdx: number, itemIdx: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIdx].items.splice(itemIdx, 1);
    setSections(updatedSections);
    recalculateSummary(updatedSections);
  };

  // Summary calculation
  const recalculateSummary = (updatedSections: Section[]) => {
    let totalDirectCost = 0;
    updatedSections.forEach(section => {
      section.items.forEach(item => {
        totalDirectCost += item.quantity * item.unitPrice;
      });
    });
    const iva = totalDirectCost * (ivaPercent / 100);
    const total = totalDirectCost + iva;
    setSummary({ totalDirectCost, iva, total });
  };

  // Terms, payment info, footer handlers
  const handleTermChange = (idx: number, value: string) => {
    const updated = [...terms];
    updated[idx] = value;
    setTerms(updated);
  };
  const addTerm = () => setTerms([...terms, '']);
  const removeTerm = (idx: number) => setTerms(terms.filter((_, i) => i !== idx));

  // Payment info
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  // Footer
  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFooter({ ...footer, [e.target.name]: e.target.value });
  };

  // Add handlers for adding, editing, and removing sections
  const addSection = () => setSections([...sections, { name: '', items: [] }]);
  const updateSectionName = (idx: number, value: string) => {
    const updated = [...sections];
    updated[idx].name = value;
    setSections(updated);
  };
  const removeSection = (idx: number) => setSections(sections.filter((_, i) => i !== idx));

  const isQuoteReady = clientData.fullName && lineItems.length > 0;

  const handleDownloadPDF = async () => {
    const doc = (
      <QuotePDF
        header={header}
        sections={sections}
        summary={summary}
        terms={terms}
        paymentInfo={paymentInfo}
        footer={footer}
        timeline={timeline}
      />
    );
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MERAV_Cotizacion_${header.project || 'proyecto'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    setSending(true);
    const doc = (
      <QuotePDF
        header={header}
        sections={sections}
        summary={summary}
        terms={terms}
        paymentInfo={paymentInfo}
        footer={footer}
        timeline={timeline}
      />
    );
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    // Placeholder: send blob to API endpoint
    const formData = new FormData();
    formData.append('file', blob, `MERAV_Cotizacion_${header.project || 'proyecto'}.pdf`);
    formData.append('email', emailToSend);
    // await fetch('/api/send-quote', { method: 'POST', body: formData });
    setSending(false);
    setShowEmailModal(false);
    setEmailToSend('');
    alert('Cotización enviada al cliente (simulado).');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">MERAV Proyectos - Generador de Cotizaciones</h1>
        <p className="text-gray-600 mt-2">Ingrese los datos del proyecto y genere una cotización profesional</p>
      </div>

      <ClientForm onClientChange={handleClientChange} />
      
      {/* Header fields form */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="project" value={header.project} onChange={handleHeaderChange} placeholder="Nombre del proyecto" />
            <Input name="client" value={header.client} onChange={handleHeaderChange} placeholder="Nombre del cliente" />
            <Input name="address" value={header.address} onChange={handleHeaderChange} placeholder="Dirección" />
            <Input name="proposal" value={header.proposal} onChange={handleHeaderChange} placeholder="Tipo de propuesta" />
            <Input name="date" value={header.date} onChange={handleHeaderChange} placeholder="Fecha" type="date" />
          </div>
        </CardContent>
      </Card>
      {/* Sections and line items form */}
      <Card>
        <CardHeader>
          <CardTitle>Renglones de Cotización</CardTitle>
        </CardHeader>
        <CardContent>
          {sections.map((section, sectionIdx) => (
            <div key={section.name + sectionIdx} className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={section.name}
                  onChange={e => updateSectionName(sectionIdx, e.target.value)}
                  placeholder={`Título de la sección (${sectionIdx + 1})`}
                  className="font-bold text-lg"
                />
                <Button variant="destructive" onClick={() => removeSection(sectionIdx)}>-</Button>
              </div>
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 items-end">
                  <Textarea
                    value={item.name}
                    onChange={e => handleLineItemChange(sectionIdx, itemIdx, 'name', e.target.value)}
                    placeholder="Descripción"
                    className="md:col-span-2"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={e => handleLineItemChange(sectionIdx, itemIdx, 'quantity', Number(e.target.value))}
                    placeholder="Cantidad"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={e => handleLineItemChange(sectionIdx, itemIdx, 'unitPrice', Number(e.target.value))}
                    placeholder="Costo Unitario"
                  />
                  <Input
                    value={(item.quantity * item.unitPrice + (item.quantity * item.unitPrice * (item.tax / 100))).toFixed(2)}
                    readOnly
                    placeholder="Total"
                  />
                  <Button variant="destructive" onClick={() => removeLineItem(sectionIdx, itemIdx)}>-</Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addLineItem(sectionIdx)} className="mt-2">Agregar renglón</Button>
            </div>
          ))}
          <Button variant="outline" onClick={addSection} className="mt-2">Agregar sección</Button>
        </CardContent>
      </Card>
      {/* Summary, terms, payment info, footer */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen y Condiciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Resumen</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input value={summary.totalDirectCost.toFixed(2)} readOnly placeholder="Total Costo Directo" />
              <Input type="number" min={0} max={100} value={ivaPercent} onChange={e => setIvaPercent(Number(e.target.value))} placeholder="IVA (%)" />
              <Input value={summary.iva.toFixed(2)} readOnly placeholder="IVA" />
              <Input value={summary.total.toFixed(2)} readOnly placeholder="TOTAL" />
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Términos y condiciones</h4>
            {terms.map((term, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Textarea value={term} onChange={e => handleTermChange(idx, e.target.value)} placeholder={`Término ${idx + 1}`} />
                <Button variant="destructive" onClick={() => removeTerm(idx)}>-</Button>
              </div>
            ))}
            <Button variant="outline" onClick={addTerm}>Agregar término</Button>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Información de pago</h4>
            <Input name="method" value={paymentInfo.method} onChange={handlePaymentInfoChange} placeholder="Forma de pago" />
            <Input name="bankDetails" value={paymentInfo.bankDetails} onChange={handlePaymentInfoChange} placeholder="Cuenta bancaria" />
          </div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Línea de Tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length > 0 && (
                <div className="relative flex items-center justify-between mb-6" style={{ minHeight: 60 }}>
                  <div className="absolute left-0 right-0 top-1/2 border-t-2 border-yellow-400 z-0" style={{ transform: 'translateY(-50%)' }} />
                  {timeline.map((event, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                      <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center" />
                      <span className="mt-2 text-xs font-semibold text-gray-900">{event.date}</span>
                      <span className="text-xs text-gray-700 text-center">{event.description}</span>
                    </div>
                  ))}
                </div>
              )}
              {timeline.map((event, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input type="date" value={event.date} onChange={e => updateTimelineEvent(idx, 'date', e.target.value)} placeholder="Fecha" />
                  <Input value={event.description} onChange={e => updateTimelineEvent(idx, 'description', e.target.value)} placeholder="Descripción" />
                  <Button variant="destructive" onClick={() => removeTimelineEvent(idx)}>-</Button>
                </div>
              ))}
              <Button variant="outline" onClick={addTimelineEvent}>Agregar evento</Button>
            </CardContent>
          </Card>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Pie de página</h4>
            <Input name="phone" value={footer.phone} onChange={handleFooterChange} placeholder="Teléfono" />
            <Input name="email" value={footer.email} onChange={handleFooterChange} placeholder="Email" />
            <Input name="address" value={footer.address} onChange={handleFooterChange} placeholder="Dirección" />
          </div>
        </CardContent>
      </Card>
      {/* Export/Share buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Exportar PDF
        </Button>
        <Button onClick={() => setShowEmailModal(true)} variant="outline" className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          Compartir con cliente
        </Button>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      </div>
      {showPDFLink && (
        <div className="flex justify-center mt-4">
          <PDFDownloadLink
            document={
              <QuotePDF
                header={header}
                sections={sections}
                summary={summary}
                terms={terms}
                paymentInfo={paymentInfo}
                footer={footer}
                timeline={timeline}
              />
            }
            fileName={`MERAV_Cotizacion_${header.project || 'proyecto'}.pdf`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {({ loading }) => loading ? 'Generando PDF...' : 'Descargar PDF'}
          </PDFDownloadLink>
        </div>
      )}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col gap-4 min-w-[320px]">
            <h2 className="text-lg font-bold">Enviar cotización al cliente</h2>
            <input
              type="email"
              className="border p-2 rounded"
              placeholder="Correo del cliente"
              value={emailToSend}
              onChange={e => setEmailToSend(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowEmailModal(false)} variant="outline">Cancelar</Button>
              <Button onClick={handleSendEmail} disabled={sending || !emailToSend}>
                {sending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteBuilder;