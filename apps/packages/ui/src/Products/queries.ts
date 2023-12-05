const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (filters: string) => [...productsKeys.lists(), { filters }] as const,
  details: () => [...productsKeys.all, 'detail'] as const,
  detail: (id: number) => [...productsKeys.details(), id] as const,
};

export {
  productsKeys,
};
