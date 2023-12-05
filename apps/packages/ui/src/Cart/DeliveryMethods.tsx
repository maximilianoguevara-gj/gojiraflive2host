import React from 'react';
import { useTranslation } from 'react-i18next';
import Radio from '../Kit/Radio';

enum DeliveryMethod {
  'unavailable',
  'takeaway',
  'delivery',
  'to_agree',
}
export type DeliveryMethodType = keyof typeof DeliveryMethod;

interface DeliveryMethodsProps {
  hasTakeAway: boolean;
  hasDelivery: boolean;
  selectedDelivery: DeliveryMethodType
  onSelectedDelivery: (newSelectedDelivery: DeliveryMethodType) => void
}

export function DeliveryMethods({
  hasTakeAway, hasDelivery, selectedDelivery, onSelectedDelivery,
}: DeliveryMethodsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col grow gap-2">
      {hasTakeAway === true && (
      <Radio
        text={t('cart.store pickup')}
        value={DeliveryMethod.takeaway}
        checked={selectedDelivery === 'takeaway'}
        onChange={() => onSelectedDelivery('takeaway')}
      />
      )}
      {hasDelivery === true && (
      <Radio
        text={t('cart.home delivery')}
        value={DeliveryMethod.delivery}
        checked={selectedDelivery === 'delivery'}
        onChange={() => onSelectedDelivery('delivery')}
      />
      )}
    </div>
  );
}
