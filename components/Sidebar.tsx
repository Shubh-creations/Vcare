import React from 'react';
import { UserState, AgentStatus } from '../types';
import { Activity, TrendingUp, Heart, Brain, ShieldAlert, Cpu } from 'lucide-react';

interface SidebarProps {
  userState: UserState;
  agents: AgentStatus[];
  onTriggerEvent: (type: 'stress' | 'wealth' | 'health') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userState, agents, onTriggerEvent }) => {
  return (
    <div className="w-full md:w-80 bg-surface border-r border-border h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Life-OS <span className="text-primary">Prime</span></h1>
            <p className="text-xs text-gray-500 font-mono">v2.5.0 // ORCHESTRATOR</p>
          </div>
        </div>
      </div>

      {/* User State Matrix */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">User State Matrix</h2>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>

        {/* Stress Metric */}
        <div className="space-y-2 group cursor-pointer" onClick={() => onTriggerEvent('stress')}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2"><Brain className="w-4 h-4"/> Neuro-Load</span>
            <span className={`font-mono font-bold ${userState.stressLevel > 6 ? 'text-red-500' : 'text-blue-400'}`}>
              {userState.stressLevel}/10
            </span>
          </div>
          <div className="h-1.5 w-full bg-surfaceHighlight rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${userState.stressLevel > 6 ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${userState.stressLevel * 10}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600 group-hover:text-primary transition-colors">Click to simulate stress spike</p>
        </div>

        {/* Wealth Metric */}
        <div className="space-y-2 group cursor-pointer" onClick={() => onTriggerEvent('wealth')}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Portfolio Drift</span>
            <span className={`font-mono font-bold ${userState.portfolioDrift > 4 ? 'text-amber-500' : 'text-green-400'}`}>
              {userState.portfolioDrift}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-surfaceHighlight rounded-full overflow-hidden">
             {/* Visualizing drift - center is 0 */}
            <div 
              className={`h-full transition-all duration-500 ${userState.portfolioDrift > 4 ? 'bg-amber-500' : 'bg-green-500'}`} 
              style={{ width: `${Math.min(userState.portfolioDrift * 10, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600 group-hover:text-wealth transition-colors">Click to simulate market vol</p>
        </div>

        {/* Health Metric */}
        <div className="space-y-2 group cursor-pointer" onClick={() => onTriggerEvent('health')}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2"><Activity className="w-4 h-4"/> Bio-Optimality</span>
            <span className={`font-mono font-bold ${userState.healthScore < 80 ? 'text-red-400' : 'text-emerald-400'}`}>
              {userState.healthScore}
            </span>
          </div>
          <div className="h-1.5 w-full bg-surfaceHighlight rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${userState.healthScore < 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${userState.healthScore}%` }}
            />
          </div>
           <p className="text-[10px] text-gray-600 group-hover:text-health transition-colors">Click to simulate bio-marker drop</p>
        </div>
      </div>

      {/* Active Agents */}
      <div className="p-6 border-t border-border flex-1">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Agent Swarm Status</h2>
        <div className="space-y-3">
          {agents.map(agent => (
            <div 
              key={agent.id} 
              className={`p-3 rounded-lg border border-border bg-surfaceHighlight/50 transition-all duration-300 ${agent.status !== 'idle' ? 'ring-1 ring-white/20 bg-surfaceHighlight' : 'opacity-60'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${agent.status === 'analyzing' ? 'animate-ping' : ''}`} style={{ backgroundColor: agent.color }}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-200">{agent.name}</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{agent.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{agent.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border text-center">
        <div className="text-[10px] text-gray-600 flex items-center justify-center gap-1">
           <ShieldAlert className="w-3 h-3" />
           <span>SECURE ENCLAVE // DATA ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
