import React, { useState, useCallback, useEffect } from 'react';
import { sendMessageToGemini } from './services/geminiService';
import { Message, UserState, AgentStatus } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { INITIAL_USER_STATE } from './constants';
import { Menu, X } from 'lucide-react';

const INITIAL_AGENTS: AgentStatus[] = [
  { id: 'Alpha', name: 'Agent Alpha', role: 'Chief of Staff', status: 'idle', color: '#3b82f6' },
  { id: 'Caduceus', name: 'Agent Caduceus', role: 'Clinical Guardian', status: 'idle', color: '#10b981' },
  { id: 'Ledger', name: 'Agent Ledger', role: 'Wealth Architect', status: 'idle', color: '#f59e0b' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeProcessingAgent, setActiveProcessingAgent] = useState<AgentStatus | undefined>(undefined);

  // Auto-send initial greeting on mount
  useEffect(() => {
    if (messages.length === 0) {
      // Small delay for effect
      setTimeout(() => {
        handleSend("System Initialized. Status Report?");
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const simulateProcessing = async () => {
    // Randomly activate agents to simulate "Parallel Sprints"
    const sequence = ['Alpha', 'Caduceus', 'Ledger'];
    
    for (const agentId of sequence) {
       // Random chance to activate an agent for "analysis" visual
       if (Math.random() > 0.3) {
          setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'analyzing' } : a));
          setActiveProcessingAgent(agents.find(a => a.id === agentId));
          await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
          setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'idle' } : a));
       }
    }
    setActiveProcessingAgent(undefined);
  };

  const handleSend = useCallback(async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Trigger visual agent simulation
      const simulationPromise = simulateProcessing();
      
      // Actual API Call
      const apiPromise = sendMessageToGemini(textToSend, userState);
      
      // Wait for both (so visuals play out at least a bit)
      const [_, responseText] = await Promise.all([simulationPromise, apiPromise]);

      if (responseText) {
        const responseMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now(),
            agent: 'Orchestrator'
        };
        setMessages(prev => [...prev, responseMessage]);
      }

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "> **SYSTEM ERROR**: Neural Link disrupted. Retrying connection...",
          timestamp: Date.now(),
          agent: 'Orchestrator'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
    }
  }, [input, isLoading, userState, agents]);

  const handleTriggerEvent = (type: 'stress' | 'wealth' | 'health') => {
      let newState = { ...userState };
      let prompt = "";

      if (type === 'stress') {
          newState.stressLevel = 9; // High stress
          prompt = "[SYSTEM ALERT]: BIOMETRIC SENSORS DETECT CORTISOL SPIKE (LEVEL 9). INITIATE EMPATHY PROTOCOL IMMEDIATELY.";
      } else if (type === 'wealth') {
          newState.portfolioDrift = 8.5; // High drift
          prompt = "[SYSTEM ALERT]: MARKET VOLATILITY DETECTED. PORTFOLIO DRIFT > 5%. INITIATE WEALTH GUARD.";
      } else if (type === 'health') {
          newState.healthScore = 65; // Low health
          prompt = "[SYSTEM ALERT]: SLEEP QUALITY CRITICAL. HRV LOW. INITIATE CLINICAL SCOUT.";
      }

      setUserState(newState);
      handleSend(prompt);
      
      // Reset state visuals after a delay for the demo effect, or keep them to show "persistence"
      // Let's keep them to allow the user to "fix" it via chat
  };

  return (
    <div className="flex h-screen w-full bg-background text-gray-100 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         <Sidebar userState={userState} agents={agents} onTriggerEvent={handleTriggerEvent} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-border bg-surface flex justify-between items-center z-30">
           <h1 className="text-lg font-bold">Life-OS Prime</h1>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400">
             {isSidebarOpen ? <X /> : <Menu />}
           </button>
        </div>

        <ChatInterface 
          messages={messages} 
          isLoading={isLoading} 
          input={input} 
          setInput={setInput} 
          onSend={() => handleSend()}
          activeAgent={activeProcessingAgent}
        />
      </div>
    </div>
  );
}
