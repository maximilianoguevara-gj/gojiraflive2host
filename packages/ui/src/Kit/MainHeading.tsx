import React from 'react';
import classNames from 'classnames';
import { Icons } from 'icons';

interface MainHeadingProps {
  title: string,
  onBackClicked: React.MouseEventHandler
  className?: string

}

export function MainHeading({ title, onBackClicked, className }: MainHeadingProps) {
  return (
    <div className={classNames('flex items-center justify-between', className)}>
      <div className="flex justify-center gap-2 items-center">
        {onBackClicked !== undefined ? (
          <Icons.Chevron.Left className="text-3xl cursor-pointer" onClick={onBackClicked} />
        ) : null}
        <h2 className="card-title capitalize text-base sm:text-2xl font-medium tracking-wider">{title}</h2>
      </div>
    </div>
  );
}
