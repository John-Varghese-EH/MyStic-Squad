
'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

const PocDisclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = sessionStorage.getItem('hasSeenPocDisclaimer');
    if (!hasSeenDisclaimer) {
      setIsOpen(true);
    }
  }, []);

  const handleAcknowledge = () => {
    sessionStorage.setItem('hasSeenPocDisclaimer', 'true');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Work in Progress (Proof of Concept)</AlertDialogTitle>
          <AlertDialogDescription>
            Welcome to Mystic Squad! Please be aware that this application is currently a
            Proof of Concept (PoC). Features are for demonstration purposes only and may not be fully functional or stable.
            Your feedback is valuable as we continue to develop and improve the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={handleAcknowledge}>Acknowledge & Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PocDisclaimer;
