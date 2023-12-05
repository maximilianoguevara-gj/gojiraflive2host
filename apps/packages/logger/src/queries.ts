interface CreateLog {
  event: string
  data: string
}

const productsKeys = {
  create: ({ event, data }: CreateLog) => {},
};

export {
  productsKeys,
};
