/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { useUtm } from '@gojiraf/useutm';
import { darken, toHsl } from '../utils';
import { useTheme, useUtmMediumFromURL } from '../hooks';

interface IButton extends React.ComponentPropsWithoutRef<'button'> {
  backgroundColor?: string;
}

function Button({
  children, backgroundColor, className = '', ...props
}: IButton) {
  const { theme } = useTheme();
  const selectedBackground = backgroundColor || theme.colors.primary;
  const style = { '--p': toHsl(selectedBackground), '--pf': darken(selectedBackground) } as CSSProperties;

  const utmMedium = useUtmMediumFromURL()
  const {isTotemDevice} = useUtm(utmMedium)

  return (
    <button
      type="button"
      style={style}
      className={classnames(`btn btn-primary h-12 text-white rounded-full disabled:bg-gray-300 disabled:text-white px-16 hover:opacity-80 ${isTotemDevice && 'w-full'}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
