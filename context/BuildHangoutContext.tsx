import { HangoutData } from '@/types/hangoutData';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface HangoutContextType {
  hangoutData: HangoutData;
  updateHangoutData: (newData: Partial<HangoutData>) => void;
  resetHangoutData: () => void;
}

const HangoutBuilderContext = createContext<HangoutContextType | undefined>(undefined);

interface HangoutBuilderProviderProps {
  children: ReactNode;
}

export const HangoutBuilderProvider: React.FC<HangoutBuilderProviderProps> = ({ children }) => {
  const [hangoutData, setHangoutData] = useState<HangoutData>({});

  const updateHangoutData = (newData: Partial<HangoutData>) => {
    setHangoutData(prevData => ({ ...prevData, ...newData }));
  };

  const resetHangoutData = () => {
    setHangoutData({});
  };

  const contextValue = {
    hangoutData,
    updateHangoutData,
    resetHangoutData,
  };

  return (
    <HangoutBuilderContext.Provider value={contextValue}>
      {children}
    </HangoutBuilderContext.Provider>
  );
};

export const useHangoutBuilder = () => {
  const context = useContext(HangoutBuilderContext);
  if (context === undefined) {
    throw new Error('useHangoutBuilder must be used within a HangoutBuilderProvider');
  }
  return context;
};