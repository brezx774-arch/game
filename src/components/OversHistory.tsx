import React from 'react';
import { DeliveryRecord } from '../types';

interface OversHistoryProps {
  history: DeliveryRecord[];
}

export const OversHistory: React.FC<OversHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div id="bar-overs-history" className="w-full max-w-2xl mx-auto px-1 my-1">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs text-white/50 font-bold tracking-widest uppercase">
          Waiting for first delivery...
        </div>
      </div>
    );
  }

  // Display recent 12 deliveries
  const recentDeliveries = [...history].slice(-12);

  return (
    <div id="bar-overs-history" className="w-full max-w-2xl mx-auto px-1 my-1 flex">
      <div className="bg-[#0f172a] border border-[#334155] rounded-sm flex items-center shadow-lg overflow-hidden w-full">
         <div className="bg-[#334155] text-white text-[10px] font-black tracking-widest px-2 py-2 flex items-center h-full">
            LAST {recentDeliveries.length}
         </div>
         <div className="flex items-center gap-1 overflow-x-auto p-1.5 no-scrollbar scroll-smooth flex-1">
          {recentDeliveries.map((del) => {
            const isWicket = del.isWicket;
            const isBoundary = del.runs === 4 || del.runs === 6;

            let bgColor = 'bg-[#1e293b] text-[#cbd5e1]';
            if (isWicket) bgColor = 'bg-[#ef4444] text-white';
            else if (isBoundary) bgColor = 'bg-[#10b981] text-white';
            else if (del.runs === 0) bgColor = 'bg-[#64748b] text-white';

            return (
              <div
                key={del.id}
                className={`shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-black text-[10px] sm:text-xs shadow-sm ${bgColor}`}
              >
                {isWicket ? 'W' : del.runs}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
