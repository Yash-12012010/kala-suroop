
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

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

interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState<'alert' | 'confirm' | 'prompt'>('alert');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [resolver, setResolver] = useState<((value: any) => void) | null>(null);

  const showAlert = (message: string, title: string = 'Alert'): Promise<void> => {
    return new Promise((resolve) => {
      setPopupType('alert');
      setTitle(title);
      setMessage(message);
      setIsOpen(true);
      setResolver(() => resolve);
    });
  };

  const showConfirm = (message: string, title: string = 'Confirm'): Promise<boolean> => {
    return new Promise((resolve) => {
      setPopupType('confirm');
      setTitle(title);
      setMessage(message);
      setIsOpen(true);
      setResolver(() => resolve);
    });
  };

  const showPrompt = (message: string, title: string = 'Input', defaultValue: string = ''): Promise<string | null> => {
    return new Promise((resolve) => {
      setPopupType('prompt');
      setTitle(title);
      setMessage(message);
      setInputValue(defaultValue);
      setIsOpen(true);
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolver) {
      if (popupType === 'alert') {
        resolver(undefined);
      } else if (popupType === 'confirm') {
        resolver(true);
      } else if (popupType === 'prompt') {
        resolver(inputValue);
      }
    }
    setIsOpen(false);
    setResolver(null);
    setInputValue('');
  };

  const handleCancel = () => {
    if (resolver) {
      if (popupType === 'confirm') {
        resolver(false);
      } else if (popupType === 'prompt') {
        resolver(null);
      }
    }
    setIsOpen(false);
    setResolver(null);
    setInputValue('');
  };

  const getIcon = () => {
    switch (popupType) {
      case 'alert':
        return <Info className="h-6 w-6 text-blue-500" />;
      case 'confirm':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'prompt':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <PopupContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-gray-900">
              {getIcon()}
              <span>{title}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-700 mb-4">{message}</p>
            {popupType === 'prompt' && (
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirm();
                  } else if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
                className="w-full"
                autoFocus
              />
            )}
          </div>

          <DialogFooter className="flex space-x-2">
            {(popupType === 'confirm' || popupType === 'prompt') && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleConfirm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {popupType === 'alert' ? 'OK' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PopupContext.Provider>
  );
};
