import React from 'react';
import classNames from 'classnames';

interface RadioProps extends React.ComponentPropsWithoutRef<'input'> {
  text: string
}

export default function Radio({ className, text, ...props }: RadioProps) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer justify-start">
        <input
          type="radio"
          className={classNames('radio radio-xs checked:bg-black border border-gray-300', className)}
          {...props}
        />
        <span className="ml-2 label-text text-black text-sm first-letter:capitalize">{text}</span>
      </label>
    </div>
  );
}
