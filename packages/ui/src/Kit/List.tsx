import React from 'react';

interface ListProps<T> {
  emptyListText: string
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode
}

export function List<T>({ emptyListText, items, renderItem }: ListProps<T>) {
  return (
    <>
      {items.length === 0 ? (
        <div className="grow w-full flex justify-center items-center">{emptyListText}</div>
      ) : (
        <>
          {
            items.map((item, index) => (
              <>{renderItem(item, index)}</>
            ))
          }
        </>
      )}
    </>
  );
}
