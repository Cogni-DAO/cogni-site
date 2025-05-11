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
      title: 'What is',
      label: 'CogniDAO?',
      action: 'What is CogniDAO?',
    },
    {
      title: 'How can I',
      label: 'use the platform?',
      action: 'How can I use the CogniDAO platform?',
    },
    {
      title: 'Tell me about',
      label: 'AI-powered organizations',
      action: 'Tell me about AI-powered organizations',
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