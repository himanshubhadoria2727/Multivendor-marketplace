// utils/filterUtils.ts

import { ActionMeta } from 'react-select';

export const clearAllFilters = (
  setSelectedPrice: React.Dispatch<React.SetStateAction<any>>,
  setSelectedDA: React.Dispatch<React.SetStateAction<any>>,
  setSelectedDR: React.Dispatch<React.SetStateAction<any>>,
  setSelectedTraffic: React.Dispatch<React.SetStateAction<any>>,
  setSelectedCountry: React.Dispatch<React.SetStateAction<any>>,
  setSelectedLinkType: React.Dispatch<React.SetStateAction<any>>,
  setSelectedNiche: React.Dispatch<React.SetStateAction<any>>,
  setSelectedLI: React.Dispatch<React.SetStateAction<any>>,
  onPriceFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void,
  onDAFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void,
  onDRFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void,
  onTrafficFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void,
  onCountryFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void,
  onLinkTypeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void,
  onNicheFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void,
  onLIFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void
) => {
  setSelectedPrice(null);
  setSelectedDA(null);
  setSelectedDR(null);
  setSelectedTraffic(null);
  setSelectedCountry(null);
  setSelectedLinkType(null);
  setSelectedNiche(null);
  setSelectedLI(null);

  const defaultActionMeta = { action: 'clear' } as ActionMeta<unknown>;

  if (onPriceFilter) onPriceFilter(null, defaultActionMeta);
  if (onDAFilter) onDAFilter(null, defaultActionMeta);
  if (onDRFilter) onDRFilter(null, defaultActionMeta);
  if (onTrafficFilter) onTrafficFilter(null, defaultActionMeta);
  if (onCountryFilter) onCountryFilter(null, defaultActionMeta);
  if (onLinkTypeFilter) onLinkTypeFilter(null, defaultActionMeta);
  if (onNicheFilter) onNicheFilter(null, defaultActionMeta);
  if (onLIFilter) onLIFilter(null, defaultActionMeta);
};
