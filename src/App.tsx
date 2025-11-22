import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ReportIssue from './components/ReportIssue';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderContent = () => {
    switch (currentSection) {
      case 'report':
        return <ReportIssue />;
      case 'dashboard':
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
      default:
        return (
          <>
            <Hero setCurrentSection={setCurrentSection} />
            <Features />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <main>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <AppContent />
    </AdminAuthProvider>
  );
}

export default App;