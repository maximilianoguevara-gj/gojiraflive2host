/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { darken, toHsl } from '../utils';
import { useTheme } from '../hooks';

function ButtonCarso({
  children, className = '', href, ...props
}: React.ComponentPropsWithoutRef<'a'>) {
  const { theme } = useTheme();
  const style = { '--p': toHsl(theme.colors.primary), '--pf': darken(theme.colors.primary) } as CSSProperties;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={style}
      className={classnames('btn btn-primary h-12 text-white rounded-full disabled:bg-gray-300 disabled:text-white xs:px-2 md:px-4 lg:px-8 xl:px-16 hover:opacity-80', className)}
      {...props}
    >
      {children}
    </a>
  );
}

export { ButtonCarso };
