const refreshInterval = Number(process.env.REACT_APP_PRODUCTS_REFRESH_INTERVAL ?? 60000);

export const productsConfig = {
  refreshInterval,
};
