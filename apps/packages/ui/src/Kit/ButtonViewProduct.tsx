/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { darken, toHsl } from '../utils';
import { useTheme } from '../hooks';

function ButtonViewProduct({
  children, className = '', ...props
}: React.ComponentPropsWithoutRef<'button'>) {
  const { theme } = useTheme();
  const style = { '--p': toHsl(theme.colors.primary), '--pf': darken(theme.colors.primary) } as CSSProperties;

  return (
    <button
      id="product-catalog-item-button-to-detail"
      type="button"
      style={style}
      className={classnames('bg-white btn btn-primary h-12 text-black hover:bg-white rounded-full min-h-full px-0 w-28 h-2', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { ButtonViewProduct };
