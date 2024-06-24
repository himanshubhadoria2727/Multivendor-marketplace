import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type Campaign = {
  id: number;
  name: string;
  totalOrder: string;
  freeToUse: string;
  totalSpending: string;
  createdAt: string;
};

type CampaignContextType = {
  campaigns: Campaign[];
  addCampaign: (name: string) => void;
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const getInitialCampaigns = (): Campaign[] => {
  if (typeof window !== 'undefined') {
    const storedCampaigns = localStorage.getItem('campaigns');
    if (storedCampaigns) {
      return JSON.parse(storedCampaigns);
    }
  }
  return [];
};

export const CampaignProvider: React.FC<Props> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(getInitialCampaigns);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
    }
  }, [campaigns]);

  const addCampaign = (name: string) => {
    const newCampaign: Campaign = {
      id: campaigns.length ? campaigns[campaigns.length - 1].id + 1 : 1,
      name,
      totalOrder: '00',
      freeToUse: '00',
      totalSpending: '00',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns(prevCampaigns => [...prevCampaigns, newCampaign]);
  };

  return (
    <CampaignContext.Provider value={{ campaigns, addCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
