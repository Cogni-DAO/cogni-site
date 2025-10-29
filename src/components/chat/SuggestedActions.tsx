"use client";

import { motion } from 'framer-motion';
import { memo } from 'react';

interface SuggestedActionsProps {
  onSuggestionClick: (action: string) => void;
}

function PureSuggestedActions({ onSuggestionClick }: SuggestedActionsProps) {
  console.log("[SuggestedActions] Rendering component.");
  const suggestedActions = [
    {
      title: 'What are the',
      label: 'active work items?',
      action: 'What are the active work items?',
    },
    {
      title: 'What memory',
      label: 'does Cogni have?',
      action: 'What memory does Cogni have? Get global memory inventory',
    },
    {
      title: 'Show me',
      label: 'recent project updates',
      action: 'Show me recent project updates and their current status',
    },
    {
      title: 'What tools',
      label: 'does CogniDAO offer?',
      action: 'What tools does CogniDAO offer?',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
        >
          <button
            type="button"
            onClick={() => onSuggestionClick(suggestedAction.action)}
            className="unified-interactive-card group text-left flex-col w-full h-auto justify-start items-start text-sm gap-1"
          >
            <span className="block font-medium group-hover:text-primary transition-colors duration-200">
              {suggestedAction.title}
            </span>
            <span className="block text-card-foreground">
              {suggestedAction.label}
            </span>
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);