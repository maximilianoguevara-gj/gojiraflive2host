import { useEffect, useState } from 'react';

export const useUtmMediumFromURL = (): string => {
  const [utmMedium, setUtmMedium] = useState('');

  useEffect(() => {
    const getUtmMediumFromURL = (): string => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      return urlSearchParams.get('utm_medium') || '';
    };

    const medium = getUtmMediumFromURL();
    setUtmMedium(medium);
  }, []);

  return utmMedium;
};
