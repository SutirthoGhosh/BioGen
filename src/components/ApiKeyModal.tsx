import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Key, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export default function ApiKeyModal({ isOpen, onClose, onSave, currentKey }: ApiKeyModalProps) {
  const [key, setKey] = useState(currentKey);

  useEffect(() => {
    setKey(currentKey);
  }, [currentKey]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="w-full max-w-sm glass-card p-6 relative overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={16} className="text-slate-500" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Key size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Gemini API Key</h2>
              <p className="text-[11px] text-slate-400">Stored locally in your browser.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500">
                Your API Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter key..."
                className="input-field"
              />
            </div>

            <button
              onClick={() => onSave(key)}
              className="btn-primary w-full py-2.5"
            >
              Save Configuration
            </button>

            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex gap-2.5">
              <ShieldCheck size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-300/60 leading-relaxed">
                Direct connections to Google only. Privacy preserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
