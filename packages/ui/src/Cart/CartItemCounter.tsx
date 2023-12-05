import React from 'react';
import { Icons } from 'icons';
import { AddProps } from './AddProduct';

interface CartItemCounterProps extends AddProps {
  count: number
  onAdd: () => void
  onRemove: () => void
}

export function CartItemCounter({ count = 1, onAdd, onRemove }: CartItemCounterProps) {
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        type="button"
        onClick={(event) => {
          onRemove();
          event.stopPropagation();
        }}
      >
        {count === 1 ? (
          <Icons.Trash.Outline />
        ) : (
          <Icons.Minus.Fill />
        )}
      </button>
      <div className="">{count}</div>
      <button
        type="button"
        onClick={(event) => {
          onAdd();
          event.stopPropagation();
        }}
      >
        <Icons.Plus.Fill />
      </button>
    </div>
  );
}
