'use client';

import { Dialog } from '@headlessui/react';
import type { BlockType } from '@/lib/types';

interface AddBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (blockType: BlockType) => void;
}

const BLOCK_TYPES: { type: BlockType; label: string; description: string; icon: string }[] = [
  {
    type: 'zigzag_hero',
    label: 'Zigzag / Hero',
    description: 'Bashliq, metn ve dinamik sekil yukleme ile bolme',
    icon: '🖼️',
  },
  {
    type: 'journey_list',
    label: 'Yolculuq / Siyahi',
    description: 'Sekil, alt bashliq ve aciklama ile tekrarlanan elementler',
    icon: '📋',
  },
  {
    type: 'values_grid',
    label: 'Deyerler Grid',
    description: 'Ikon, bashliq ve aciklama ile kartlar sheklinde grid',
    icon: '🏛️',
  },
];

export default function AddBlockDialog({ open, onClose, onSelect }: AddBlockDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
          <Dialog.Title className="text-lg font-semibold tracking-tight text-text-primary mb-4">
            Blok tipi secin
          </Dialog.Title>
          <div className="space-y-3">
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                type="button"
                onClick={() => {
                  onSelect(bt.type);
                  onClose();
                }}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{bt.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary tracking-tight">
                      {bt.label}
                    </p>
                    <p className="text-xs text-text-secondary tracking-tight mt-0.5">
                      {bt.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium tracking-tight text-text-secondary hover:bg-slate-50 transition-colors"
            >
              Legv et
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
