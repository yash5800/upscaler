import React from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + V / Cmd + V', action: 'Paste image directly from clipboard' },
    { key: 'Spacebar', action: 'Toggle Before / After split comparison mode' },
    { key: 'Enter', action: 'Start AI Upscaling job' },
    { key: 'Esc', action: 'Reset studio or exit Fullscreen mode' },
    { key: 'D', action: 'Download high-res upscaled PNG output' },
    { key: 'F', action: 'Toggle Fullscreen preview' },
    { key: '?', action: 'Open Keyboard Shortcuts guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-white/10 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">⌨️</span>
            <h3 className="text-lg font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-muted font-medium">{s.action}</span>
              <kbd className="px-2.5 py-1 rounded bg-white/10 border border-white/15 font-mono text-xs text-accent font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-muted">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white">Esc</kbd> to close anytime
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
