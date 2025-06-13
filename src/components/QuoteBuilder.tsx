import React, { useState, useRef, useEffect } from 'react';
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

interface ProjectIntroduction {
  overview: string;
  objectives: string;
  benefits: string;
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
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  cost: number;
  currency: string;
  tax: number;
}

const DEFAULT_SECTIONS = [
  {
    id: '1',
    title: 'Levantamiento de Requerimientos',
    description: 'Reuniones con áreas clave para entender necesidades, procesos y flujos de datos.',
    cost: 240,
    currency: 'USD'
  },
  {
    id: '2',
    title: 'Diseño y Arquitectura del Sistema',
    description: 'Estructura técnica, base de datos, modularidad y escalabilidad.',
    cost: 290,
    currency: 'USD'
  },
  {
    id: '3',
    title: 'Desarrollo Backend',
    description: 'Lógica de negocio, validaciones, conexión entre módulos, APIs.',
    cost: 440,
    currency: 'USD'
  },
  {
    id: '4',
    title: 'Desarrollo Frontend / UI',
    description: 'Pantallas, formularios, navegación amigable, visual corporativa.',
    cost: 390,
    currency: 'USD'
  },
  {
    id: '5',
    title: 'Visualización de Datos',
    description: 'Dashboards de indicadores para monitoreo en tiempo real.',
    cost: 290,
    currency: 'USD'
  },
  {
    id: '6',
    title: 'Automatización de Procesos',
    description: 'Flujos automáticos: reportes, alertas, seguimientos.',
    cost: 340,
    currency: 'USD'
  },
  {
    id: '7',
    title: 'Pruebas y Validación',
    description: 'Testeo técnico y funcional del sistema.',
    cost: 140,
    currency: 'USD'
  },
  {
    id: '8',
    title: 'Documentación y Capacitación',
    description: 'Manuales básicos de uso y capacitación para usuarios internos.',
    cost: 140,
    currency: 'USD'
  },
  {
    id: '9',
    title: 'Soporte y Mantenimiento Inicial (6 meses)',
    description: 'Soporte técnico, corrección de errores y ajustes operativos.',
    cost: 230,
    currency: 'USD'
  }
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

  // Project Introduction
  const [introduction, setIntroduction] = useState<ProjectIntroduction>({
    overview: `Grupo Premium Inmobiliario se encuentra en una etapa de crecimiento que demanda una transformación digital estratégica para consolidar su operación y fortalecer su liderazgo en el sector inmobiliario. Este proyecto tiene como objetivo el desarrollo e implementación de una solución tecnológica integral que unifique, automatice y optimice los procesos internos clave, al tiempo que se mejora significativamente la experiencia de sus clientes a través de un portal digital personalizado.\n\nLa plataforma a desarrollar permitirá centralizar la información proveniente de distintas áreas (ventas, ingeniería, finanzas, legal, postventa, entre otras), facilitando una gestión más ágil, transparente y basada en datos. Asimismo, incluirá un portal de clientes que ofrecerá acceso en tiempo real a reportes, estados de cuenta, avances de obra y documentos relevantes, fortaleciendo la confianza y la transparencia entre la empresa y sus clientes.`,
    objectives: `• Diseñar e implementar un sistema centralizado para la gestión operativa y estratégica de proyectos inmobiliarios.\n• Digitalizar los flujos de trabajo internos, reduciendo el uso de herramientas dispersas como hojas de cálculo.\n• Automatizar tareas administrativas, aprobaciones, reportes y comunicaciones internas.\n• Mejorar la trazabilidad, el control y la auditoría de procesos en tiempo real.\n• Ofrecer indicadores clave (KPIs) para la toma de decisiones estratégicas basadas en datos.\n• Desarrollar un portal seguro para clientes, con acceso a información actualizada de sus proyectos.\n• Incrementar la eficiencia operativa y la calidad del servicio brindado por la empresa.`,
    benefits: `• Estandarización y control de procesos a nivel organizacional.\n• Ahorro significativo de tiempo operativo gracias a la automatización de tareas repetitivas.\n• Acceso en tiempo real a información crítica para la toma de decisiones estratégicas.\n• Reducción de errores humanos y mejoras en la calidad del servicio al cliente.\n• Transparencia y confianza fortalecidas mediante un portal de clientes personalizado.\n• Mayor escalabilidad del negocio al contar con una plataforma digital adaptable.\n• Imagen institucional modernizada alineada con las mejores prácticas tecnológicas del sector.`
  });

  // Sections and line items
  const [sections, setSections] = useState<Section[]>(() => 
    DEFAULT_SECTIONS.map(section => ({
      name: section.title,
      items: [{
        id: section.id,
        type: 'service',
        name: section.title,
        description: section.description,
        quantity: 1,
        unit: 'servicio',
        unitPrice: section.cost,
        cost: section.cost,
        currency: section.currency,
        tax: 0
      }]
    }))
  );

  // Summary
  const [summary, setSummary] = useState<SummaryFields>({
    totalDirectCost: 0,
    iva: 5,
    total: 0,
  });

  // Terms, payment info, footer
  const [terms, setTerms] = useState<string[]>([
    'Alcance limitado al detalle de esta cotización. No se incluye ningún otro servicio que no esté expresamente indicado en los renglones de esta propuesta técnica y económica.',
    'El desarrollo se iniciará al recibir el anticipo y aprobación formal por escrito (correo o firma digital) por parte del cliente.',
    'La duración total del proyecto es de 10 a 12 semanas, sujeto a los tiempos de respuesta del cliente en validaciones y aprobaciones.',
    'El código fuente y documentación serán propiedad del cliente una vez se complete el pago total. El uso del software estará limitado a los fines definidos por Grupo Premium Inmobiliario.',
    'Se incluye soporte técnico y mantenimiento correctivo por 3 meses a partir de la entrega final. Servicios posteriores se cotizarán por separado.',
    'Cualquier servicio de terceros (licencias, servidores, suscripciones a plataformas como Power BI, etc.) no está incluido salvo que se especifique expresamente.',
    'Las funcionalidades adicionales o cambios significativos posteriores a la aprobación inicial serán cotizados y autorizados por separado.'
  ]);
  const [paymentInfo, setPaymentInfo] = useState({
    method: '25% de anticipación / 75% al entregar el proyecto',
    bankName: 'Banco Industrial',
    recipientName: 'Franz Hentze Movil',
    accountNumber: '0180077836',
    accountType: 'Monetaria',
    currency: 'Quetzales'
  });
  const [footer, setFooter] = useState({
    phone: '(502) 3040-3813',
    email: 'franz@soluciones-atn.com',
    address: ''
  });

  // Timeline
  const [timeline, setTimeline] = useState([
    { date: '', description: 'Inicio del Proyecto y Levantamiento de Requerimientos' },
    { date: '', description: 'Diseño de Arquitectura y Prototipo de Interfaz' },
    { date: '', description: 'Desarrollo e Integración del Sistema' },
    { date: '', description: 'Pruebas, Capacitación y Puesta en Marcha' }
  ]);

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
      description: '',
      quantity: 1,
      unit: '',
      unitPrice: 0,
      cost: 0,
      currency: '',
      tax: 0
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
        introduction={introduction}
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
        introduction={introduction}
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

  useEffect(() => {
    // Calculate subtotal
    const subtotal = sections.reduce((sum, section) =>
      sum + section.items.reduce((itemSum, item) =>
        itemSum + (item.quantity * item.unitPrice), 0), 0);
    // Calculate IVA
    const ivaAmount = subtotal * (summary.iva / 100);
    // Calculate total
    const total = subtotal + ivaAmount;
    setSummary(prev => ({ ...prev, totalDirectCost: subtotal, total }));
  }, [sections, summary.iva]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Información del Proyecto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Proyecto</label>
              <input
                type="text"
                value={header.project}
                onChange={(e) => setHeader({ ...header, project: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <input
                type="text"
                value={header.client}
                onChange={(e) => setHeader({ ...header, client: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                value={header.address}
                onChange={(e) => setHeader({ ...header, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Propuesta</label>
              <input
                type="text"
                value={header.proposal}
                onChange={(e) => setHeader({ ...header, proposal: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                value={header.date}
                onChange={(e) => setHeader({ ...header, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Project Introduction Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Introducción al Proyecto</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción General</label>
              <textarea
                value={introduction.overview}
                onChange={(e) => setIntroduction({ ...introduction, overview: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Objetivos</label>
              <textarea
                value={introduction.objectives}
                onChange={(e) => setIntroduction({ ...introduction, objectives: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Beneficios</label>
              <textarea
                value={introduction.benefits}
                onChange={(e) => setIntroduction({ ...introduction, benefits: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Renglones de Cotización</h2>
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
                    value={item.description}
                    onChange={e => handleLineItemChange(sectionIdx, itemIdx, 'description', e.target.value)}
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
        </div>

        {/* Summary, terms, payment info, footer */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Resumen y Condiciones</h2>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Resumen</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Costo Directo Total</label>
                <input
                  type="number"
                  value={summary.totalDirectCost}
                  onChange={(e) => setSummary({ ...summary, totalDirectCost: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IVA</label>
                <input
                  type="number"
                  value={summary.iva}
                  onChange={(e) => setSummary({ ...summary, iva: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <input
                  type="number"
                  value={summary.total}
                  onChange={(e) => setSummary({ ...summary, total: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
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
            <h4 className="font-semibold mb-2">Información de Pago</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                <input
                  type="text"
                  value={paymentInfo.method}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, method: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Banco</label>
                <input
                  type="text"
                  value={paymentInfo.bankName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Recipiente</label>
                <input
                  type="text"
                  value={paymentInfo.recipientName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, recipientName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Cuenta</label>
                <input
                  type="text"
                  value={paymentInfo.accountNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Cuenta</label>
                <input
                  type="text"
                  value={paymentInfo.accountType}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, accountType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Moneda</label>
                <input
                  type="text"
                  value={paymentInfo.currency}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, currency: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
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
        </div>

        {/* Export/Share buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <PDFDownloadLink
            document={
              <QuotePDF
                header={header}
                introduction={introduction}
                sections={sections}
                summary={summary}
                terms={terms}
                paymentInfo={paymentInfo}
                footer={footer}
                timeline={timeline}
              />
            }
            fileName={`cotizacion-${header.project}-${header.date}.pdf`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Generando PDF...' : 'Descargar PDF'
            }
          </PDFDownloadLink>
          <Button
            variant="outline"
            onClick={() => {
              // Share functionality
            }}
          >
            Compartir
          </Button>
        </div>
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
    </div>
  );
};

export default QuoteBuilder;