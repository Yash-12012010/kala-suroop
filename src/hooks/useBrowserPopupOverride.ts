
import { useEffect } from 'react';
import { usePopup } from '@/contexts/PopupContext';

export const useBrowserPopupOverride = () => {
  const { showAlert, showConfirm, showPrompt } = usePopup();

  useEffect(() => {
    // Store original functions
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    // Override browser popups with custom ones
    window.alert = (message: string) => {
      showAlert(message);
    };

    window.confirm = (message: string): boolean => {
      // For synchronous confirm, we'll need to handle this differently
      // This is a simplified version - in real scenarios you might need to restructure code to be async
      let result = false;
      showConfirm(message).then(confirmed => {
        result = confirmed;
      });
      return result;
    };

    window.prompt = (message: string, defaultText?: string): string | null => {
      // Similar limitation as confirm - this is simplified
      let result: string | null = null;
      showPrompt(message, 'Input', defaultText).then(value => {
        result = value;
      });
      return result;
    };

    // Cleanup function to restore original functions
    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    };
  }, [showAlert, showConfirm, showPrompt]);
};
