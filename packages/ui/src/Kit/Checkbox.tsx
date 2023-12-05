import React from 'react';
import classNames from 'classnames';

interface CheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  text: string
}

export default function Checkbox({ className, text, ...props }: CheckboxProps) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer justify-start">
        <input
          type="checkbox"
          className={classNames('checkbox checkbox-primary checkbox-xs border border-gray-300 rounded-md', className)}
          {...props}
        />
        <span className="ml-2 label-text text-black text-sm">{text}</span>
      </label>
    </div>
  );
}
