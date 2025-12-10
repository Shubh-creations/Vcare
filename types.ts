export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  agent?: 'Alpha' | 'Caduceus' | 'Ledger' | 'Orchestrator';
}

export interface UserState {
  stressLevel: number; // 1-10
  portfolioDrift: number; // Percentage
  healthScore: number; // 1-100
}

export interface AgentStatus {
  id: 'Alpha' | 'Caduceus' | 'Ledger';
  name: string;
  role: string;
  status: 'idle' | 'analyzing' | 'active';
  color: string;
}

export type ViewMode = 'chat' | 'dashboard';