import React from 'react';
import { Icons } from 'icons';
import classNames from 'classnames';
import { MainHeading } from '../Kit/MainHeading';

interface EmptyCartProps {
  title: string
  subtitle: string
  onBackClicked: React.MouseEventHandler;
}

export default function EmptyCart({
  title,
  subtitle,
  onBackClicked,

}: EmptyCartProps) {
  return (
    <div id="products" className="h-full card bg-base-100">
      <div className="card-body pt-4 sm:pt-8">
        <MainHeading title={title} onBackClicked={onBackClicked} />
        <div className="flex items-center justify-between mt-6">
          <span>{subtitle}</span>
          <Icons.Cart.Outline className={classNames('text-3xl font-bold')} />
        </div>
      </div>
    </div>
  );
}
