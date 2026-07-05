import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Filter, 
  ExternalLink 
} from 'lucide-react';

interface NotificationsViewProps {
  notifications: any[];
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (view: any) => void;
}

export default function NotificationsView({
  notifications,
  onClearNotification,
  onClearAll,
  onNavigate
}: NotificationsViewProps) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'scholarship':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'milestone':
        return <CheckCircle2 className="w-4 h-4 text-[#10B981]" />;
      default:
        return <Zap className="w-4 h-4 text-[#8B5CF6]" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'alert':
        return 'border-red-500/10 hover:border-red-500/30';
      case 'scholarship':
        return 'border-amber-500/10 hover:border-amber-500/30';
      case 'milestone':
        return 'border-emerald-500/10 hover:border-emerald-500/30';
      default:
        return 'border-[#8B5CF6]/15 hover:border-[#8B5CF6]/30';
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 font-sans text-zinc-900 dark:text-[#F9FAFB] bg-transparent">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-blue-600 dark:text-[#3B82F6]" />
            <span>Notification & Alert Hub</span>
          </h2>
          <p className="text-xs text-zinc-550 dark:text-[#9CA3AF] mt-1">View real-time alerts, upcoming closing dates, and parsing records from parsing agents.</p>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline cursor-pointer font-semibold flex items-center gap-1 bg-red-500/5 px-3 py-1.5 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Dismiss All Alerts</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#1F2937] border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl space-y-4 max-w-md mx-auto transition-colors shadow-sm">
          <Bell className="w-10 h-10 text-zinc-400 dark:text-zinc-650 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-300">All caught up!</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-550 mt-1">
              There are no pending alerts or parser messages. We will notify you when new opportunities matching your major are indexed.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('Dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#3B82F6] dark:hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <AnimatePresence>
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`p-4 rounded-2xl border flex items-start gap-4 shadow-sm dark:shadow-md bg-white dark:bg-[#1F2937] border-zinc-200 dark:border-zinc-800/80 transition-all duration-300 group ${getTypeStyle(notif.type)}`}
              >
                <div className="p-2 bg-zinc-50 dark:bg-[#0B0F19] rounded-xl border border-zinc-200 dark:border-zinc-800/80 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-455 dark:text-zinc-500">
                      {notif.type} log
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-805 dark:text-zinc-200 font-semibold leading-relaxed pr-8">
                    {notif.text}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (notif.type === 'scholarship') onNavigate('Scholarships');
                        else if (notif.type === 'milestone') onNavigate('My Roadmap');
                        else onNavigate('Dashboard');
                      }}
                      className="text-[10px] font-bold text-blue-600 dark:text-[#3B82F6] hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <span>Take Action</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onClearNotification(notif.id)}
                  className="absolute right-3 top-3.5 p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0B0F19] hover:bg-zinc-100 dark:hover:bg-[#111827] transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Clear alert"
                >
                  <Check className="w-4 h-4" />
                </button>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
