import { useMediaQuery } from 'react-responsive';

export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const dimensions = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

const xsQuery = `(min-width: ${dimensions.xs})`;
const smQuery = `(min-width: ${dimensions.sm})`;
const mdQuery = `(min-width: ${dimensions.md})`;
const lgQuery = `(min-width: ${dimensions.lg})`;
const xlQuery = `(min-width: ${dimensions.xl})`;
const twoXlQuery = `(min-width: ${dimensions['2xl']})`;

const devices: Map<DeviceType, string> = new Map();
devices.set('xs', xsQuery);
devices.set('sm', smQuery);
devices.set('md', mdQuery);
devices.set('lg', lgQuery);
devices.set('xl', xlQuery);
devices.set('2xl', twoXlQuery);

const useDevices = () => {
  const isXs = useMediaQuery({
    query: devices.get('xs'),
  });

  const isSm = useMediaQuery({
    query: devices.get('sm'),
  });

  const isMd = useMediaQuery({
    query: devices.get('md'),
  });

  const isLg = useMediaQuery({
    query: devices.get('lg'),
  });

  const isXl = useMediaQuery({
    query: devices.get('xl'),
  });

  const is2xl = useMediaQuery({
    query: devices.get('2xl'),
  });

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
  };
};

export { useDevices };
