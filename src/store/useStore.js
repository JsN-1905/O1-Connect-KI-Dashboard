import { create } from 'zustand';

const useStore = create((set, get) => ({
  tickets: [],
  notifications: [],
  kpis: { total: 0, deflected: 0, escalated: 0, avgConfidence: 0 },
  activeTicketId: null,
  simulatorRunning: true,
  activityFeed: [],

  addTicket: (ticket) => set(state => ({
    tickets: [ticket, ...state.tickets],
    kpis: { ...state.kpis, total: state.kpis.total + 1 },
    activityFeed: [
      { id: Date.now() + Math.random(), type: 'new', text: `${ticket.customer.name} — Neues Ticket eingegangen`, time: Date.now() },
      ...state.activityFeed.slice(0, 14),
    ],
  })),

  updateTicket: (id, updates) => set(state => ({
    tickets: state.tickets.map(t => t.id === id ? { ...t, ...updates } : t),
  })),

  addMessage: (ticketId, message) => set(state => ({
    tickets: state.tickets.map(t =>
      t.id === ticketId
        ? {
            ...t,
            messages: [...t.messages, message],
            confidenceHistory: message.confidence
              ? [...(t.confidenceHistory || []), message.confidence].slice(-8)
              : t.confidenceHistory,
          }
        : t
    ),
  })),

  setTyping: (ticketId, isTyping) => set(state => ({
    tickets: state.tickets.map(t => t.id === ticketId ? { ...t, isTyping } : t),
  })),

  escalateTicket: (id, reason) => set(state => {
    const ticket = state.tickets.find(t => t.id === id);
    if (!ticket) return {};
    const notification = {
      id: Date.now() + Math.random(),
      ticketId: id,
      customer: ticket.customer,
      intent_category: ticket.intent_category || 'CANCELLATION',
      reason,
      time: Date.now(),
    };
    return {
      tickets: state.tickets.map(t => t.id === id ? { ...t, status: 'escalated', isTyping: false } : t),
      notifications: [notification, ...state.notifications],
      kpis: { ...state.kpis, escalated: state.kpis.escalated + 1 },
      activityFeed: [
        { id: Date.now() + Math.random(), type: 'escalated', text: `${ticket.customer.name} — Eskaliert ⚡`, time: Date.now() },
        ...state.activityFeed.slice(0, 14),
      ],
    };
  }),

  resolveTicket: (id, confidence) => set(state => {
    const ticket = state.tickets.find(t => t.id === id);
    if (!ticket) return {};
    const newDeflected = state.kpis.deflected + 1;
    const resolvedTickets = state.tickets.filter(t => t.status === 'resolved');
    const allConf = [...resolvedTickets.map(t => t.finalConfidence || 85), confidence];
    const avg = Math.round(allConf.reduce((a, b) => a + b, 0) / allConf.length);
    return {
      tickets: state.tickets.map(t => t.id === id ? { ...t, status: 'resolved', isTyping: false, finalConfidence: confidence } : t),
      kpis: { ...state.kpis, deflected: newDeflected, avgConfidence: avg },
      activityFeed: [
        { id: Date.now() + Math.random(), type: 'resolved', text: `${ticket.customer.name} — KI gelöst ✓ (${confidence}% Konfidenz)`, time: Date.now() },
        ...state.activityFeed.slice(0, 14),
      ],
    };
  }),

  dismissNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  setTicketHuman: (id) => set(state => ({
    tickets: state.tickets.map(t => t.id === id ? { ...t, status: 'human', isTyping: false } : t),
  })),

  setActiveTicket: (id) => set({ activeTicketId: id }),
}));

export default useStore;
