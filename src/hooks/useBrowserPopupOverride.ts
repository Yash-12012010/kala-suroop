
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

    // For confirm and prompt, we'll intercept and use our custom popups
    // Note: This approach has limitations due to sync/async nature
    window.confirm = (message: string): boolean => {
      // We'll show our custom confirm but can't properly await it in a sync context
      // The real confirmation logic should be handled in the components using usePopup directly
      showConfirm(message);
      return false; // Return false to prevent default behavior, let custom popup handle it
    };

    window.prompt = (message: string, defaultText?: string): string | null => {
      // Same limitation as confirm
      showPrompt(message, 'Input', defaultText);
      return null; // Return null to prevent default, let custom popup handle it
    };

    // Add custom functions to window for easier access
    (window as any).customAlert = showAlert;
    (window as any).customConfirm = showConfirm;
    (window as any).customPrompt = showPrompt;

    // Cleanup function to restore original functions
    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
      delete (window as any).customAlert;
      delete (window as any).customConfirm;
      delete (window as any).customPrompt;
    };
  }, [showAlert, showConfirm, showPrompt]);

  // Return the popup functions for direct use in components
  return { showAlert, showConfirm, showPrompt };
};
