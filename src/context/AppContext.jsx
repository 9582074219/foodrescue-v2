import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  DEFAULT_DONORS,
  DEFAULT_RECEIVERS,
  INITIAL_DONATIONS,
  INITIAL_CHAT_MESSAGES,
  calculateUrgency,
  calculateMatchScore
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Real-Time Cross-Tab Broadcast Channel
  const [channel, setChannel] = useState(null);

  // Active Authenticated User (null = Auth Gateway / Login Page first)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('foodrescue_v2_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Donations Database (Synchronized)
  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('foodrescue_v2_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  // Chat Message Database
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('foodrescue_v2_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Active Chat Modal State
  const [activeChatDonation, setActiveChatDonation] = useState(null);

  // 80G Certificate Modal State
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [certDonation, setCertDonation] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  // Initialize BroadcastChannel for Zero-Lag Multi-Tab Sync
  useEffect(() => {
    try {
      const bc = new BroadcastChannel('foodrescue_v2_channel');
      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_DONATIONS') {
          setDonations(payload);
        } else if (type === 'NEW_DONATION_ALERT') {
          showToast(`🍱 New Donation Available: ${payload.quantity} Meals (${payload.foodType})`, 'info');
        } else if (type === 'DONATION_ACCEPTED_ALERT') {
          showToast(`🤝 Donation #${payload.id} accepted by ${payload.matchedNgoName}!`, 'success');
        } else if (type === 'FOOD_DISTRIBUTED_ALERT') {
          showToast(`🎉 Meals distributed by ${payload.matchedNgoName}! Moved to History.`, 'success');
          triggerConfetti();
        } else if (type === 'NEW_CHAT_MSG') {
          setChatMessages(prev => {
            const list = prev[payload.donationId] || [];
            return {
              ...prev,
              [payload.donationId]: [...list, payload.message]
            };
          });
        }
      };
      setChannel(bc);
      return () => bc.close();
    } catch (e) {
      console.log('BroadcastChannel not supported', e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('foodrescue_v2_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('foodrescue_v2_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('foodrescue_v2_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('foodrescue_v2_user');
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error', e);
    }
  };

  // 1. Authentication Handlers
  const loginUser = (userProfile) => {
    setCurrentUser(userProfile);
    showToast(`Logged in as ${userProfile.name} (${userProfile.role})`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  // 2. Lifecycle: Create & Broadcast Donation (Donor Side)
  const createAndBroadcastDonation = (formData) => {
    const urgency = calculateUrgency(formData);
    const newDonation = {
      id: `FR-${Math.floor(2000 + Math.random() * 9000)}`,
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorPhone: currentUser.phone || '+91 98220 54321',
      donorAddress: formData.location || currentUser.address,
      foodType: formData.foodType,
      foodCategory: formData.foodCategory || 'Cooked Meal',
      quantity: Number(formData.quantity) || 50,
      preparedAt: formData.preparedAt || '08:30 PM',
      availableUntil: formData.availableUntil || '12:30 AM',
      safeHoursRemaining: 3.5,
      urgencyScore: urgency.score,
      urgencyLevel: urgency.level,
      temperature: '65°C (Freshly Cooked)',
      packaging: 'Sealed Containers',
      status: 'AVAILABLE', // Broadcast status
      matchedNgoId: null,
      matchedNgoName: null,
      driverName: null,
      driverPhone: null,
      createdAt: new Date().toISOString(),
      acceptedAt: null,
      collectedAt: null,
      distributedAt: null,
      notes: formData.notes || 'Ready for pickup.'
    };

    const updated = [newDonation, ...donations];
    setDonations(updated);

    // Broadcast across browser tabs
    if (channel) {
      channel.postMessage({ type: 'SYNC_DONATIONS', payload: updated });
      channel.postMessage({ type: 'NEW_DONATION_ALERT', payload: newDonation });
    }

    triggerConfetti();
    showToast(`Donation #${newDonation.id} listed & broadcasted to nearby NGOs!`, 'success');
    return newDonation;
  };

  // 3. Lifecycle: NGO Accepts Donation
  const acceptDonation = (donationId, ngoUser = currentUser) => {
    const updated = donations.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'ACCEPTED',
          matchedNgoId: ngoUser.id,
          matchedNgoName: ngoUser.name,
          driverName: 'Rescue Driver (Van #01)',
          driverPhone: ngoUser.phone || '+91 98765 43210',
          acceptedAt: new Date().toISOString()
        };
      }
      return d;
    });

    setDonations(updated);

    const targetDonation = updated.find(d => d.id === donationId);

    // Broadcast update across tabs
    if (channel) {
      channel.postMessage({ type: 'SYNC_DONATIONS', payload: updated });
      channel.postMessage({ type: 'DONATION_ACCEPTED_ALERT', payload: targetDonation });
    }

    // Add initial greeting message in chat
    const initialMsg = {
      id: `msg_${Date.now()}`,
      senderRole: 'RECEIVER',
      senderName: ngoUser.name,
      text: `Hello! We have accepted your donation of ${targetDonation.quantity} meals. Our rescue team will be there shortly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => {
      const list = prev[donationId] || [];
      const newMap = { ...prev, [donationId]: [...list, initialMsg] };
      if (channel) {
        channel.postMessage({ type: 'NEW_CHAT_MSG', payload: { donationId, message: initialMsg } });
      }
      return newMap;
    });

    triggerConfetti();
    showToast(`Donation #${donationId} accepted! Locked for your organization.`, 'success');

    // Auto-open chat modal for seamless communication
    setActiveChatDonation(targetDonation);
  };

  // 4. Lifecycle: Mark Food Collected
  const markFoodCollected = (donationId) => {
    const updated = donations.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'COLLECTED',
          collectedAt: new Date().toISOString()
        };
      }
      return d;
    });

    setDonations(updated);

    if (channel) {
      channel.postMessage({ type: 'SYNC_DONATIONS', payload: updated });
    }

    showToast(`Donation #${donationId} marked as COLLECTED. On route to beneficiaries.`, 'info');
  };

  // 5. Lifecycle: Mark Distributed to Needy People (COMPLETED)
  const markDistributedToNeedy = (donationId) => {
    const updated = donations.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'COMPLETED',
          distributedAt: new Date().toISOString()
        };
      }
      return d;
    });

    setDonations(updated);
    const targetDonation = updated.find(d => d.id === donationId);

    if (channel) {
      channel.postMessage({ type: 'SYNC_DONATIONS', payload: updated });
      channel.postMessage({ type: 'FOOD_DISTRIBUTED_ALERT', payload: targetDonation });
    }

    triggerConfetti();
    showToast(`🎉 Food safely distributed to beneficiaries! Moved to History.`, 'success');
  };

  // 6. Direct Chat Send Message Handler
  const sendChatMessage = (donationId, text) => {
    if (!text || !text.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderRole: currentUser?.role || 'DONOR',
      senderName: currentUser?.name || 'User',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => {
      const list = prev[donationId] || [];
      const updated = { ...prev, [donationId]: [...list, newMsg] };
      return updated;
    });

    if (channel) {
      channel.postMessage({ type: 'NEW_CHAT_MSG', payload: { donationId, message: newMsg } });
    }
  };

  // 7. Certificate Trigger
  const openCertificate = (donation) => {
    setCertDonation(donation);
    setIsCertOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        loginUser,
        logoutUser,
        donations,
        createAndBroadcastDonation,
        acceptDonation,
        markFoodCollected,
        markDistributedToNeedy,
        chatMessages,
        sendChatMessage,
        activeChatDonation,
        setActiveChatDonation,
        isCertOpen,
        setIsCertOpen,
        certDonation,
        openCertificate,
        toast,
        showToast,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
