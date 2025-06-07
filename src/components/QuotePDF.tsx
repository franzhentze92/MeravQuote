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
    borderBottom: '2px solid #FFEB3B',
    paddingBottom: 4,
  },
  logoText: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 0,
  },
  logoMain: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    letterSpacing: 2,
  },
  logoSub: {
    fontWeight: 'normal',
    fontSize: 7,
    color: '#000',
    letterSpacing: 1,
    marginTop: -2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#b38600',
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
    borderLeft: '3px solid #FFEB3B',
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
    backgroundColor: '#FFEB3B',
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    borderBottom: '1px solid #000',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#fffde7',
    border: '1px solid #FFEB3B',
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
    borderTop: '1px solid #FFEB3B',
    textAlign: 'center',
    paddingTop: 3,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
  },
  bullet: {
    fontWeight: 'bold',
    color: '#FFEB3B',
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
    backgroundColor: '#FFEB3B',
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
    backgroundColor: '#FFEB3B',
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
  paymentInfo: { method: string; bankDetails: string };
  footer: { phone: string; email: string; address: string };
  timeline: { date: string; description: string }[];
}

const QuotePDF: React.FC<QuotePDFProps> = ({ header, sections, summary, terms, paymentInfo, footer, timeline }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoText}>
            <Text style={styles.logoMain}>MERAV</Text>
            <Text style={styles.logoSub}>PROYECTOS</Text>
          </View>
          <View>
            <Text style={styles.infoBlock}>Proyecto: {header.project}</Text>
            <Text style={styles.infoBlock}>Cliente: {header.client}</Text>
            <Text style={styles.infoBlock}>Dirección: {header.address}</Text>
            <Text style={styles.infoBlock}>Propuesta: {header.proposal}</Text>
            <Text style={styles.infoBlock}>Fecha: {header.date}</Text>
          </View>
        </View>
        <View style={styles.spacer} />
        {/* Table */}
        {sections.filter(section => section.items.length > 0).map((section, idx) => (
          <View key={section.name} wrap={false}>
            <Text style={styles.sectionTitle}>{idx + 1}. {section.name}</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 3 }]}>Descripción</Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>Cantidades</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Costo Unitario</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Total</Text>
              </View>
              {section.items.map((item, i) => {
                const subtotal = item.quantity * item.unitPrice;
                const itemTax = subtotal * (item.tax / 100);
                const total = subtotal + itemTax;
                return (
                  <View style={styles.tableRow} key={item.id}>
                    <Text style={[styles.tableCell, { flex: 0.7 }]}>{i + 1}</Text>
                    <Text style={[styles.tableCell, { flex: 3 }]}>{item.name}</Text>
                    <Text style={[styles.tableCell, { flex: 1.2 }]}>{item.quantity}</Text>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.unitPrice.toFixed(2)}</Text>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{total.toFixed(2)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
        {/* Summary */}
        <View style={styles.summary}>
          <Text>Total Costo Directo: Q {summary.totalDirectCost.toFixed(2)}</Text>
          <Text>IVA: Q {summary.iva.toFixed(2)}</Text>
          <Text style={{ fontWeight: 'bold' }}>TOTAL: Q {summary.total.toFixed(2)}</Text>
        </View>
        {/* Terms */}
        <View style={styles.terms}>
          <Text style={{ fontWeight: 'bold' }}>Términos y condiciones:</Text>
          {terms.map((term, idx) => (
            <Text key={idx}><Text style={styles.bullet}>•</Text> {term}</Text>
          ))}
        </View>
        {/* Payment info */}
        <View style={styles.payment}>
          <Text style={{ fontWeight: 'bold' }}>Información de pago:</Text>
          <Text><Text style={styles.bullet}>•</Text> Forma de pago: {paymentInfo.method}</Text>
          <Text><Text style={styles.bullet}>•</Text> Datos de cuenta para depósitos: {paymentInfo.bankDetails}</Text>
        </View>
        {timeline.length > 0 && (
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />
            <View style={styles.timelineEvents}>
              {timeline.map((event, idx) => (
                <View key={idx} style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={styles.timelineDate}>{event.date}</Text>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineLabel}>{event.description}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text>Vo. Bo. Cliente</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Vo. Bo. GRUPO MERAV</Text>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text>Tel.: {footer.phone}  Email: {footer.email}</Text>
          <Text>Dirección: {footer.address}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default QuotePDF; 