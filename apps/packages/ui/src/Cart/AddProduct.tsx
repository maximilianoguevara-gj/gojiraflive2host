import React from 'react';
import { Icons } from 'icons';

export interface AddProps extends React.ComponentPropsWithoutRef<'button'> {
}

export function AddProduct({ ...props }: AddProps) {
  return (
    <button type="button" className="btn btn-xs sm:btn-sm btn-secondary gap-2" {...props}>
      <Icons.Cart.Fill />
      Add
    </button>
  );
}
