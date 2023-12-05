import React from 'react';
import { useUtm } from '@gojiraf/useutm';
import { StyledBadge } from '../Cart';
import { ProductImage, ProductImageProps } from './ProductImage';
import { useUtmMediumFromURL } from '../hooks';

interface BadgeProps {
  badgeContent: string,
  badgeVisible: boolean,
}

interface FeatureProductProps extends ProductImageProps {
  badgeProps: BadgeProps;
}

export function FeatureProduct({
  url, onClick, title, badgeProps,
}: FeatureProductProps) {
  const { badgeContent, badgeVisible } = badgeProps;

  const utmMedium = useUtmMediumFromURL();
  const { isTotemDevice } = useUtm(utmMedium);

  const badgeStyleTotem = {
    '& .MuiBadge-badge': {
      fontSize: '2rem',
      padding: '7%',
    },
  };

  return (

    <>
      {badgeVisible ? (
        <StyledBadge
          color="primary"
          customStyles={{ marginRight: '0.625rem' }}
          badgeContent={badgeContent}
          sx={isTotemDevice ? badgeStyleTotem : {}}
        >
          <ProductImage
            className="cursor-pointer"
            onClick={onClick}
            url={url}
            title={title}
            onKeyPress={() => { }}
          />
        </StyledBadge>
      ) : (
        <ProductImage
          className="cursor-pointer"
          onClick={onClick}
          url={url}
          title={title}
          onKeyPress={() => { }}
        />
      )}
    </>

  );
}
