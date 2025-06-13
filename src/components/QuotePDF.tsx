import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image
} from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 7,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8fafc',
  },
  mainContent: {
    backgroundColor: '#fff',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    borderBottom: '2px solid #38B2AC',
    paddingBottom: 4,
  },
  logoText: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 0,
  },
  logoMain: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    letterSpacing: 2,
    textAlign: 'center',
  },
  logoSub: {
    fontWeight: 'normal',
    fontSize: 10,
    color: '#000',
    letterSpacing: 1,
    marginTop: -2,
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#38B2AC',
    letterSpacing: 1,
  },
  infoBlock: {
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
    textAlign: 'justify',
    fontSize: 7,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    marginTop: 10,
    marginBottom: 4,
    color: '#000',
    borderLeft: '3px solid #38B2AC',
    paddingLeft: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
  },
  table: {
    flexDirection: 'column',
    width: 'auto',
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
    border: '1px solid #000',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableCell: {
    padding: 3,
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    color: '#000',
    textAlign: 'center',
    fontWeight: 'normal',
    backgroundColor: '#fff',
    fontSize: 7,
  },
  tableHeader: {
    backgroundColor: '#38B2AC',
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    borderBottom: '1px solid #000',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#E6FFFA',
    border: '1px solid #38B2AC',
    borderRadius: 4,
    padding: 6,
    marginTop: 8,
    marginBottom: 8,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 8,
    textAlign: 'justify',
  },
  terms: {
    marginTop: 6,
    marginBottom: 6,
    color: '#000',
    textAlign: 'justify',
    fontSize: 7,
  },
  payment: {
    marginTop: 6,
    marginBottom: 6,
    color: '#000',
    textAlign: 'justify',
    fontSize: 7,
  },
  footer: {
    marginTop: 12,
    borderTop: '1px solid #cbd5e1',
    paddingTop: 4,
    fontSize: 6,
    textAlign: 'center',
    color: '#000',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  signatureBox: {
    width: '40%',
    borderTop: '1px solid #38B2AC',
    textAlign: 'center',
    paddingTop: 3,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
  },
  bullet: {
    fontWeight: 'bold',
    color: '#38B2AC',
    fontSize: 8,
  },
  spacer: {
    height: 16,
  },
  timelineContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  timelineLine: {
    height: 2,
    backgroundColor: '#38B2AC',
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  timelineEvents: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#38B2AC',
    border: '2.5px solid #000',
    zIndex: 2,
    marginTop: 2,
    marginBottom: 2,
  },
  timelineDate: {
    fontWeight: 'bold',
    fontSize: 8,
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  timelineLabel: {
    marginTop: 8,
    width: 90,
    textAlign: 'center',
    fontSize: 8,
    color: '#000',
  },
  introduction: {
    marginTop: 10,
    marginBottom: 10,
  },
  introductionTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#38B2AC',
    marginBottom: 4,
  },
  introductionText: {
    fontSize: 8,
    color: '#000',
    marginBottom: 6,
    textAlign: 'justify',
  },
  bulletList: {
    fontSize: 8,
    color: '#000',
    marginLeft: 10,
    marginBottom: 6,
  },
});

// Props type
interface QuotePDFProps {
  header: {
    project: string;
    client: string;
    address: string;
    proposal: string;
    date: string;
  };
  introduction: {
    overview: string;
    objectives: string;
    benefits: string;
  };
  sections: {
    name: string;
    items: {
      id: string;
      type: string;
      name: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      tax: number;
    }[];
  }[];
  summary: {
    totalDirectCost: number;
    iva: number;
    total: number;
  };
  terms: string[];
  paymentInfo: {
    method: string;
    bankName: string;
    recipientName: string;
    accountNumber: string;
    accountType: string;
    currency: string;
  };
  footer: {
    phone: string;
    email: string;
    address: string;
  };
  timeline: {
    date: string;
    description: string;
  }[];
}

const QuotePDF: React.FC<QuotePDFProps> = ({
  header,
  introduction = {
    overview: '',
    objectives: '',
    benefits: ''
  },
  sections,
  summary,
  terms,
  paymentInfo,
  footer,
  timeline
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoText}>
            <Text style={styles.logoMain}>SOLUCIONES</Text>
            <Text style={styles.logoSub}>ATN</Text>
          </View>
          <Text style={styles.title}>COTIZACIÓN</Text>
        </View>

        {/* Project Information */}
        <View style={styles.infoBlock}>
          <Text>Proyecto: {header.project}</Text>
          <Text>Cliente: {header.client}</Text>
          <Text>Dirección: {header.address}</Text>
          <Text>Propuesta: {header.proposal}</Text>
          <Text>Fecha: {header.date}</Text>
        </View>

        {/* Project Introduction */}
        {introduction.overview && (
          <View style={styles.introduction}>
            <Text style={styles.introductionTitle}>Descripción General</Text>
            <Text style={styles.introductionText}>{introduction.overview}</Text>

            {introduction.objectives && (
              <>
                <Text style={styles.introductionTitle}>Objetivos</Text>
                <Text style={styles.bulletList}>{introduction.objectives}</Text>
              </>
            )}

            {introduction.benefits && (
              <>
                <Text style={styles.introductionTitle}>Beneficios</Text>
                <Text style={styles.bulletList}>{introduction.benefits}</Text>
              </>
            )}
          </View>
        )}

        {/* Sections */}
        {sections.filter(section => section.items.length > 0).map((section, idx) => (
          <View key={section.name} wrap={false}>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '5%' }]}>#</Text>
                <Text style={[styles.tableCell, { width: '35%' }]}>Descripción</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>Cant.</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>Unidad</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>Precio Unit.</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>Subtotal</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>IVA</Text>
              </View>
              {section.items.map((item, itemIdx) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{itemIdx + 1}</Text>
                  <Text style={[styles.tableCell, { width: '35%' }]}>{item.name}</Text>
                  <Text style={[styles.tableCell, { width: '10%' }]}>{item.quantity}</Text>
                  <Text style={[styles.tableCell, { width: '10%' }]}>{item.unit}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>$ {item.unitPrice.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>$ {(item.quantity * item.unitPrice).toFixed(2)}</Text>
                  <Text style={[styles.tableCell, { width: '10%' }]}>$ {(item.quantity * item.unitPrice * 0.05).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <Text>Costo Directo Total: $ {summary.totalDirectCost.toFixed(2)}</Text>
          <Text>IVA: $ {summary.iva.toFixed(2)}</Text>
          <Text>Total: $ {summary.total.toFixed(2)}</Text>
        </View>

        {/* Terms */}
        <View style={styles.terms}>
          <Text style={styles.sectionTitle}>Términos y Condiciones</Text>
          {terms.map((term, idx) => (
            <Text key={idx} style={{ marginBottom: 4 }}><Text style={styles.bullet}>•</Text> {term}</Text>
          ))}
        </View>

        {/* Payment Information */}
        <View style={styles.payment}>
          <Text style={styles.sectionTitle}>Información de Pago</Text>
          <Text>Método de Pago: {paymentInfo.method}</Text>
          <Text>Banco: {paymentInfo.bankName}</Text>
          <Text>Nombre del Recipiente: {paymentInfo.recipientName}</Text>
          <Text>Número de Cuenta: {paymentInfo.accountNumber}</Text>
          <Text>Tipo de Cuenta: {paymentInfo.accountType}</Text>
          <Text>Moneda: {paymentInfo.currency}</Text>
        </View>

        {/* Timeline */}
        {timeline.length > 0 && (
          <View style={styles.timelineContainer}>
            <Text style={styles.sectionTitle}>Cronograma del Proyecto</Text>
            <View style={styles.timelineLine} />
            <View style={styles.timelineEvents}>
              {timeline.map((event, idx) => (
                <View key={idx} style={{ alignItems: 'center', width: `${100 / timeline.length}%` }}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineDate}>{event.date}</Text>
                  <Text style={styles.timelineLabel}>{event.description}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Spacers between timeline and signatures */}
        <View style={{ height: 12 }} />
        <View style={{ height: 12 }} />
        <View style={{ height: 12 }} />
        <View style={{ height: 12 }} />

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text>Vo. Bo. Cliente</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Vo. Bo. SOLUCIONES ATN</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>SOLUCIONES ATN</Text>
          <Text>Tel: {footer.phone}</Text>
          <Text>Email: {footer.email}</Text>
          <Text>Copyright© 2025. Todos los derechos reservados para SOLUCIONES ATN.</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default QuotePDF; 