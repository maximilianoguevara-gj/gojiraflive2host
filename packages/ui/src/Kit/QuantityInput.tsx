import React from 'react';
import { Icons } from 'icons';
import { useGoogleAnalytics, useMatomoAnalytics } from '@gojiraf/analytics';
import { AddProps } from '../Cart/AddProduct';

interface QuantityInputProps extends AddProps {
  quantity: number
  noQuantityLimitReached?: boolean
  canDelete?: boolean
  onAdd: () => void
  onRemove: () => void
  productName: string
}

export function QuantityInput({
  quantity = 1, noQuantityLimitReached = true, canDelete = false, onAdd, onRemove, productName,
}: QuantityInputProps) {
  const { gaEventTracker } = useGoogleAnalytics();
  const { matomoTrackEvent } = useMatomoAnalytics();

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={(event) => {
          gaEventTracker('InCall > Products', `decrease/delete-quantity-product [${productName}]`);
          matomoTrackEvent('InCall > Products', `decrease/delete-quantity-product [${productName}]`);
          onRemove();
          event.stopPropagation();
        }}
      >
        {quantity === 1 ? (
          <>
            {canDelete === true ? (
              <Icons.Trash.Outline />
            ) : (
              <Icons.Minus.Fill className="text-gray-300 cursor-not-allowed" />
            )}
          </>
        ) : (
          <Icons.Minus.Fill />
        )}
      </button>
      <div className="">{quantity}</div>
      <button
        type="button"
        onClick={(event) => {
          gaEventTracker('InCall > Products', `increase-quantity-of-products [${productName}]`);
          matomoTrackEvent('InCall > Products', `increase-quantity-of-products [${productName}]`);
          onAdd();
          event.stopPropagation();
        }}
      >
        {noQuantityLimitReached === true ? <Icons.Plus.Fill /> : <Icons.Plus.Fill className="text-gray-300 cursor-not-allowed" />}
      </button>
    </div>
  );
}
