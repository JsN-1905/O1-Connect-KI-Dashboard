import useStore from '../store/useStore';
import { customers } from '../data/customers';
import { scenarios } from '../data/scenarios';

let mainInterval = null;
const cancelledTickets = new Set();
const ticketTimeouts = new Map();

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function registerTimeout(ticketId, fn, delay) {
  const id = setTimeout(() => {
    if (!ticketTimeouts.has(ticketId)) return;
    const set = ticketTimeouts.get(ticketId);
    set.delete(id);
    fn();
  }, delay);
  if (!ticketTimeouts.has(ticketId)) ticketTimeouts.set(ticketId, new Set());
  ticketTimeouts.get(ticketId).add(id);
  return id;
}

export function cancelTicket(ticketId) {
  cancelledTickets.add(ticketId);
  const ids = ticketTimeouts.get(ticketId);
  if (ids) {
    ids.forEach(id => clearTimeout(id));
    ticketTimeouts.delete(ticketId);
  }
}

function isCancelled(ticketId) {
  if (cancelledTickets.has(ticketId)) return true;
  const ticket = useStore.getState().tickets.find(t => t.id === ticketId);
  return !ticket || ticket.status === 'human';
}

function runSteps(ticketId, steps, stepIndex, cumulativeDelay) {
  if (stepIndex >= steps.length) return;

  const step = steps[stepIndex];
  const baseDelay = cumulativeDelay + (step.delay || 1500);

  registerTimeout(ticketId, () => {
    if (isCancelled(ticketId)) return;

    if (step.role === 'kai') {
      useStore.getState().setTyping(ticketId, true);

      registerTimeout(ticketId, () => {
        if (isCancelled(ticketId)) return;

        useStore.getState().setTyping(ticketId, false);
        useStore.getState().addMessage(ticketId, {
          id: Date.now() + Math.random(),
          role: 'kai',
          message: step.message,
          confidence: step.confidence,
          intent_category: step.intent_category,
          action: step.action,
          timestamp: Date.now(),
          responseTime: (900 + rand(0, 500)) / 1000,
        });

        if (step.intent_category) {
          useStore.getState().updateTicket(ticketId, { intent_category: step.intent_category });
        }

        if (step.action === 'escalate') {
          registerTimeout(ticketId, () => {
            if (!cancelledTickets.has(ticketId)) {
              useStore.getState().escalateTicket(ticketId, step.message);
            }
          }, 400);
          return;
        }

        runSteps(ticketId, steps, stepIndex + 1, 0);
      }, 950);
    } else {
      useStore.getState().addMessage(ticketId, {
        id: Date.now() + Math.random(),
        role: 'customer',
        message: step.message,
        timestamp: Date.now(),
      });

      runSteps(ticketId, steps, stepIndex + 1, 0);
    }
  }, baseDelay);
}

function spawnTicket() {
  const { tickets } = useStore.getState();
  const activeCount = tickets.filter(t => t.status === 'active').length;
  if (activeCount >= 8) return;

  const customer = pick(customers);
  const scenario = pick(scenarios);
  const ticketId = uid();

  const ticket = {
    id: ticketId,
    customer,
    scenario,
    status: 'active',
    messages: [],
    confidenceHistory: [],
    isTyping: false,
    intent_category: null,
    createdAt: Date.now(),
    finalConfidence: null,
  };

  useStore.getState().addTicket(ticket);

  runSteps(ticketId, scenario.steps, 0, 0);

  const lastStep = [...scenario.steps].reverse().find(s => s.role === 'kai');
  const totalDelay = scenario.steps.reduce((sum, s) => sum + (s.delay || 1500), 0) + 1500;

  if (scenario.finalStatus === 'resolved') {
    registerTimeout(ticketId, () => {
      if (cancelledTickets.has(ticketId)) return;
      const t = useStore.getState().tickets.find(x => x.id === ticketId);
      if (t && t.status === 'active') {
        useStore.getState().resolveTicket(ticketId, lastStep?.confidence || 87);
      }
    }, totalDelay);
  }
}

export function startSimulator() {
  spawnTicket();
  setTimeout(spawnTicket, rand(5000, 10000));

  mainInterval = setInterval(() => {
    if (useStore.getState().simulatorRunning) {
      spawnTicket();
    }
  }, rand(18000, 40000));
}

export function stopSimulator() {
  if (mainInterval) {
    clearInterval(mainInterval);
    mainInterval = null;
  }
}
