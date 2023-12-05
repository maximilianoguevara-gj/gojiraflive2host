/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useUtm } from '@gojiraf/useutm';
import { useUtmMediumFromURL } from '../hooks';

export interface ProductImageProps extends React.ComponentPropsWithoutRef<'div'> {
  url: string
  title: string
  onClick(event: React.MouseEvent<HTMLImageElement>): void;
  onKeyPress(event: React.KeyboardEvent<HTMLImageElement>): void;
}

export function ProductImage({
  url, title, onClick, onKeyPress, className,
}: ProductImageProps) {
  const utmMedium = useUtmMediumFromURL();
  const { isTotemDevice } = useUtm(utmMedium);

  return (
    <div id="product-catalog-item-image-to-detail-button" className={className} onClick={onClick} onKeyPress={onKeyPress}>
      <figure className={`${isTotemDevice ? 'w-52 h-52' : 'w-20 h-20 '}  mobileXs:w-18 mobileXs:h-18`}>
        <img className={`${isTotemDevice ? 'w-52 h-52' : 'w-20 h-20'} mobileXs:w-18 mobileXs:h-18 object-cover rounded-lg`} alt={title} src={url} />
      </figure>
    </div>
  );
}
