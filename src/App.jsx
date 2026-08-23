import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import DirectChatModal from './components/DirectChatModal';
import CertificateModal from './components/CertificateModal';

import AuthGateway from './pages/AuthGateway';
import DonorPortal from './pages/DonorPortal';
import ReceiverPortal from './pages/ReceiverPortal';
import AdminPortal from './pages/AdminPortal';

function PortalRouter() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <AuthGateway />;
  }

  if (currentUser.role === 'DONOR') {
    return <DonorPortal />;
  }

  if (currentUser.role === 'RECEIVER') {
    return <ReceiverPortal />;
  }

  if (currentUser.role === 'ADMIN') {
    return <AdminPortal />;
  }

  return <AuthGateway />;
}

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <PortalRouter />
      </main>
      <Footer />
      <Toast />
      <DirectChatModal />
      <CertificateModal />
    </div>
  );
}
