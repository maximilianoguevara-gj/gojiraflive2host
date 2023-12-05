/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import React, { ComponentPropsWithoutRef } from 'react';
import { Icons } from 'icons';
import classNames from 'classnames';
import { useViews } from 'state';
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics';
import { Badge, BadgeProps, styled } from '@mui/material';
import { useCart } from './useCart';

interface ExtendedBadgeProps extends BadgeProps {
  customStyles?: React.CSSProperties,
}

export const StyledBadge = styled(Badge)<ExtendedBadgeProps>(({ customStyles }) => ({
  '& .MuiBadge-badge': {
    fontFamily: 'Montserrat',
    backgroundColor: '#F93700',
    ...customStyles,
  },
}));

export interface CartCountProps extends ComponentPropsWithoutRef<'svg'> {
  cartItemsAmount?: number;
}

function CartCountPresentation({ cartItemsAmount, className, ...props }: CartCountProps) {
  const { send: sendViews } = useViews();

  const { gaEventTracker } = useGoogleAnalytics();
  const { matomoTrackEvent } = useMatomoAnalytics()

  const handleGoToCart = () => {
    gaEventTracker('InCall > Products', 'go-to-cart');
    matomoTrackEvent('InCall > Products', 'go-to-cart');
    sendViews({
      type: 'SHOW_CART',
    });
  };

  return (
    <div
      onClick={handleGoToCart}
      className="cursor-pointer relative flex justify-center items-center"
    >
      <StyledBadge badgeContent={cartItemsAmount} max={99} color="primary">
        <Icons.Cart.Outline className={classNames('text-2xl', className)} {...props} />
      </StyledBadge>
    </div>
  );
}

interface CartCountContainer {}

export function CartCount(props: CartCountContainer) {
  const { state } = useCart();

  const totalItems = Array.from(state.context.variants)?.reduce(
    (acc, v) => acc + v[1],
    0,
  ) as number;

  return <CartCountPresentation cartItemsAmount={totalItems} {...props} />;
}
