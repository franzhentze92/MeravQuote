import React from 'react';
import QuoteBuilder from './QuoteBuilder';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 12 }}>
                <span style={{ fontWeight: 'bold', color: '#000', fontSize: 22, letterSpacing: 2 }}>SOLUCIONES</span>
                <span style={{ color: '#000', fontSize: 12, letterSpacing: 1, marginTop: -4 }}>ATN</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-8">
        <QuoteBuilder />
      </main>
      
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            Copyright© 2025. Todos los derechos reservados para SOLUCIONES ATN.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;