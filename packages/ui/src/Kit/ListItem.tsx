/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import classNames from 'classnames';
import { ProductImage } from '../Products/ProductImage';

interface ListItemProps extends React.ComponentPropsWithoutRef<'div'> {
  itemId: string;
  imageUrl: string;
  onProductClicked: (itemId: string) => void;
  title: string;
  renderBottomMid?: React.ReactElement | null;
  renderTopRight?: React.ReactElement | null;
  renderBottomRight?: React.ReactElement | null;
}

export function ListItem({
  itemId,
  imageUrl,
  title,
  renderBottomMid = null,
  renderTopRight = null,
  renderBottomRight = null,
  className,
  onProductClicked,
}: ListItemProps) {
  return (
    <div onClick={() => onProductClicked(itemId)} className={classNames('max-h-32 snap-start scroll-mt-4 overflow-visible py-7', className)}>
      <div className="flex gap-4">
        <ProductImage
          url={imageUrl}
          title={title}
          onClick={() => {}}
          onKeyPress={() => {}}
        />
        <div className="flex flex-col gap-1 grow min-w-0">
          <div className="flex gap-4 grow items-start">
            <h2
              style={{
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box',
              }}
              className="grow overflow-hidden text-ellipsis text-sm font-medium capitalize break-words"
            >
              {title}
            </h2>
            <div>{renderTopRight}</div>
          </div>
          <div className="flex gap-4 h-2/5 items-end justify-end">
            {renderBottomMid}
            {renderBottomRight}
          </div>
        </div>
      </div>
    </div>
  );
}
