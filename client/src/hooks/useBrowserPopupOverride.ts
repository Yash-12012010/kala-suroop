
import { usePopup } from '@/contexts/PopupContext';

export const useBrowserPopupOverride = () => {
  const { showAlert, showConfirm, showPrompt } = usePopup();

  // Override default browser popups
  if (typeof window !== 'undefined') {
    // Store original functions
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    // Override with custom implementations
    window.alert = (message?: string) => {
      showAlert(message || '', 'Alert');
    };

    window.confirm = (message?: string): boolean => {
      // For synchronous compatibility, we'll use a flag
      let result = false;
      showConfirm(message || '', 'Confirm').then((confirmed) => {
        result = confirmed;
      });
      return result;
    };

    window.prompt = (message?: string, defaultValue?: string): string | null => {
      let result: string | null = null;
      showPrompt(message || '', 'Input', defaultValue).then((input) => {
        result = input;
      });
      return result;
    };
  }

  return {
    showAlert,
    showConfirm,
    showPrompt
  };
};
