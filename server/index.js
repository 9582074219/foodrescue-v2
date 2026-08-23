// FoodRescue V2 — Node.js & Express REST API Backend
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database Store
let donationsDb = [];
let chatDb = {};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'FoodRescue V2 API', timestamp: new Date().toISOString() });
});

// 1. Auth Endpoint
app.post('/api/auth/login', (req, res) => {
  const { role, name } = req.body;
  res.json({
    success: true,
    user: {
      id: `user_${Date.now()}`,
      name: name || 'Demo User',
      role: role || 'DONOR'
    }
  });
});

// 2. Donations Endpoints
app.get('/api/donations', (req, res) => {
  res.json({ success: true, count: donationsDb.length, data: donationsDb });
});

app.post('/api/donations', (req, res) => {
  const newDonation = {
    id: `FR-${Math.floor(2000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'AVAILABLE',
    createdAt: new Date().toISOString()
  };
  donationsDb.unshift(newDonation);
  res.status(201).json({ success: true, data: newDonation });
});

app.patch('/api/donations/:id/accept', (req, res) => {
  const { id } = req.params;
  const { ngoId, ngoName } = req.body;
  const item = donationsDb.find(d => d.id === id);
  if (item) {
    item.status = 'ACCEPTED';
    item.matchedNgoId = ngoId;
    item.matchedNgoName = ngoName;
    item.acceptedAt = new Date().toISOString();
    return res.json({ success: true, data: item });
  }
  res.status(404).json({ success: false, message: 'Donation not found' });
});

app.patch('/api/donations/:id/collect', (req, res) => {
  const { id } = req.params;
  const item = donationsDb.find(d => d.id === id);
  if (item) {
    item.status = 'COLLECTED';
    item.collectedAt = new Date().toISOString();
    return res.json({ success: true, data: item });
  }
  res.status(404).json({ success: false, message: 'Donation not found' });
});

app.patch('/api/donations/:id/distribute', (req, res) => {
  const { id } = req.params;
  const item = donationsDb.find(d => d.id === id);
  if (item) {
    item.status = 'COMPLETED';
    item.distributedAt = new Date().toISOString();
    return res.json({ success: true, data: item });
  }
  res.status(404).json({ success: false, message: 'Donation not found' });
});

// 3. Chat Endpoints
app.get('/api/chat/:donationId', (req, res) => {
  const { donationId } = req.params;
  res.json({ success: true, messages: chatDb[donationId] || [] });
});

app.post('/api/chat/:donationId', (req, res) => {
  const { donationId } = req.params;
  const { senderRole, senderName, text } = req.body;
  const msg = {
    id: `msg_${Date.now()}`,
    senderRole,
    senderName,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  if (!chatDb[donationId]) chatDb[donationId] = [];
  chatDb[donationId].push(msg);
  res.status(201).json({ success: true, message: msg });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`FoodRescue V2 API Server running on port ${PORT}`);
  });
}

module.exports = app;
