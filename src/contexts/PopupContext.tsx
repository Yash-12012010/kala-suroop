
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PopupContextType {
  showAlert: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  showPrompt: (message: string, title?: string, defaultValue?: string) => Promise<string | null>;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

interface PopupState {
  type: 'alert' | 'confirm' | 'prompt' | null;
  title: string;
  message: string;
  isOpen: boolean;
  resolve?: (value: any) => void;
  defaultValue?: string;
  inputValue?: string;
}

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<PopupState>({
    type: null,
    title: '',
    message: '',
    isOpen: false,
  });

  const showAlert = (message: string, title: string = 'Alert'): Promise<void> => {
    return new Promise((resolve) => {
      setPopup({
        type: 'alert',
        title,
        message,
        isOpen: true,
        resolve,
      });
    });
  };

  const showConfirm = (message: string, title: string = 'Confirm'): Promise<boolean> => {
    return new Promise((resolve) => {
      setPopup({
        type: 'confirm',
        title,
        message,
        isOpen: true,
        resolve,
      });
    });
  };

  const showPrompt = (message: string, title: string = 'Input', defaultValue: string = ''): Promise<string | null> => {
    return new Promise((resolve) => {
      setPopup({
        type: 'prompt',
        title,
        message,
        isOpen: true,
        resolve,
        defaultValue,
        inputValue: defaultValue,
      });
    });
  };

  const handleClose = () => {
    if (popup.resolve) {
      if (popup.type === 'confirm') {
        popup.resolve(false);
      } else if (popup.type === 'prompt') {
        popup.resolve(null);
      } else {
        popup.resolve(undefined);
      }
    }
    setPopup({ ...popup, isOpen: false });
  };

  const handleConfirm = () => {
    if (popup.resolve) {
      if (popup.type === 'confirm') {
        popup.resolve(true);
      } else if (popup.type === 'prompt') {
        popup.resolve(popup.inputValue || '');
      } else {
        popup.resolve(undefined);
      }
    }
    setPopup({ ...popup, isOpen: false });
  };

  const handleInputChange = (value: string) => {
    setPopup({ ...popup, inputValue: value });
  };

  return (
    <PopupContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      
      <Dialog open={popup.isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{popup.title}</DialogTitle>
            <DialogDescription>
              {popup.message}
            </DialogDescription>
          </DialogHeader>
          
          {popup.type === 'prompt' && (
            <div className="grid gap-2">
              <Label htmlFor="popup-input">Enter value:</Label>
              <Input
                id="popup-input"
                value={popup.inputValue || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={popup.defaultValue}
                autoFocus
              />
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            {popup.type === 'alert' ? (
              <Button onClick={handleConfirm} className="w-full">
                OK
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm}>
                  {popup.type === 'confirm' ? 'Confirm' : 'OK'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PopupContext.Provider>
  );
};
