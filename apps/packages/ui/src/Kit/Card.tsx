import { Icons } from 'icons';
import React from 'react';
import { useUtm } from '@gojiraf/useutm';
import { useUtmMediumFromURL } from '../hooks';

interface CardProps {
  title: string
  isLightIntegration?: boolean
  onGoBack?: React.MouseEventHandler
  renderTop?: React.ReactElement | null
  renderMiddle?: React.ReactElement
  renderBottom?: React.ReactElement | null
}

export default function Card({
  title,
  isLightIntegration,
  onGoBack,
  renderTop,
  renderMiddle,
  renderBottom,
}: CardProps) {
  const utmMedium = useUtmMediumFromURL();
  const { isTotemDevice } = useUtm(utmMedium);

  return (
    <div id="products" className="h-full card bg-base-100">
      <div className="card-body px-0 pt-4 sm:pt-8 snap-y overflow-y-auto overflow-x-hidden">
        <div className="flex items-center justify-between px-8">
          <div className="flex justify-center gap-2 items-center">
            {onGoBack !== undefined ? (
              <Icons.Chevron.Left className="text-3xl cursor-pointer" onClick={onGoBack} />
            ) : null}
            <h2 className="card-title capitalize text-base sm:text-2xl font-medium tracking-wider">{title}</h2>
          </div>
          {renderTop}
        </div>
        <div className={`snap-y overflow-y-auto overflow-x-hidden grow flex flex-col px-8 ${isTotemDevice && 'gap-32'}`}>
          {renderMiddle}
        </div>
        <div className="card-actions justify-center items-center mt-4 p-6">
          {renderBottom}
        </div>
      </div>
    </div>
  );
}
