/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Settings, 
  Instagram, 
  Twitter, 
  Hash, 
  Loader2,
  ChevronRight,
  User,
  Briefcase,
  Zap
} from 'lucide-react';
import { BioTone, BioResult, UserInput } from './types';
import { generateBios } from './lib/gemini';
import ApiKeyModal from './components/ApiKeyModal';
import CopyButton from './components/CopyButton';

const TONES: { id: BioTone; label: string; description: string }[] = [
  { id: 'luxury', label: 'Luxury', description: 'Sophisticated & refined' },
  { id: 'professional', label: 'Professional', description: 'Clear & capable' },
  { id: 'savage', label: 'Savage', description: 'Bold & edgy' },
  { id: 'minimal', label: 'Minimal', description: 'Short & sharp' },
];

export default function App() {
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('gemini_api_key') || '');
  const [isModalOpen, setIsModalOpen] = useState(!apiKey);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [input, setInput] = useState<UserInput>({
    name: '',
    niche: '',
    tone: 'professional'
  });

  const [results, setResults] = useState<BioResult | null>(null);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setIsModalOpen(false);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }
    if (!input.name || !input.niche) {
      setError('Name and niche are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await generateBios(input, apiKey);
      setResults(data);
    } catch (err) {
      setError('Generation failed. Check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      <header className="border-b border-slate-800/50 py-4 px-4 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="text-slate-900" size={18} />
            </div>
            <h1 className="font-bold text-base tracking-tight">AI Bio Gen</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            <Settings size={18} className="text-slate-400" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[320px,1fr] gap-8 items-start">
          
          {/* Input Panel */}
          <aside className="space-y-6">
            <div className="glass-card p-5 space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Parameters</h2>
                <p className="text-[11px] text-slate-400">Define your identity blueprint.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
                    <User size={10} /> Name
                  </label>
                  <input
                    type="text"
                    placeholder="Alex Rivera"
                    value={input.name}
                    onChange={(e) => setInput({ ...input, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
                    <Briefcase size={10} /> Niche
                  </label>
                  <input
                    type="text"
                    placeholder="Strategy Designer"
                    value={input.niche}
                    onChange={(e) => setInput({ ...input, niche: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
                    <Zap size={10} /> Tone
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setInput({ ...input, tone: tone.id })}
                        className={`text-left p-2 rounded-lg border text-xs transition-all ${
                          input.tone === tone.id 
                            ? 'bg-white border-white text-slate-950 font-medium' 
                            : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 text-slate-400'
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-[10px] bg-red-400/5 p-2 rounded-md border border-red-400/20">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      Generate
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="space-y-10">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <ResultCategory 
                    title="Instagram" 
                    icon={<Instagram size={18} />} 
                    items={results.instagram} 
                  />
                  <ResultCategory 
                    title="Twitter / X" 
                    icon={<Twitter size={18} />} 
                    items={results.twitter} 
                  />
                  <ResultCategory 
                    title="Taglines" 
                    icon={<Hash size={18} />} 
                    items={results.taglines} 
                  />
                </motion.div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-3 glass-card bg-transparent border-dashed border-slate-800">
                  <Sparkles size={32} className="text-slate-800" />
                  <div>
                    <h3 className="text-sm font-medium text-slate-400">Ready for generation</h3>
                    <p className="text-[11px] text-slate-500">Your custom bios will appear here.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveKey}
        currentKey={apiKey}
      />
    </div>
  );
}

function ResultCategory({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-400">
        <div className="p-1.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
          {icon}
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group flex items-start justify-between p-4 glass-card hover:bg-slate-800/50 hover:border-slate-700 transition-all"
          >
            <p className="text-xs leading-relaxed text-slate-300 pr-4">{item}</p>
            <div className="shrink-0 -mt-1 -mr-1">
              <CopyButton text={item} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
