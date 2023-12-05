import { method } from 'lodash';
import { Product } from './IProduct';

const {
  REACT_APP_PRODUCTS_MICROSERVICE_QUERY,
} = process.env;

interface FetchProducts {
  featuredProducts: Product['id'][]
  products: Product[]
}

interface HighlightProduct {
  productId: Product['id']
  callId: string
  accessToken: string | null | undefined
}

const fetchProducts = async (callId: string): Promise<FetchProducts> => {
  const products = await fetch(
    `${REACT_APP_PRODUCTS_MICROSERVICE_QUERY}/api/product-query/${callId}`,
  ).then((res: any) => res.json() as FetchProducts);

  return products;
};

const highlightProduct = async ({ callId, productId, accessToken } : HighlightProduct) => {
  try {
    await fetch(
      `${REACT_APP_PRODUCTS_MICROSERVICE_QUERY}/api/product-query/${callId}/product/main`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ids: [productId],
        }),
      },
    );
  } catch (error) {
    console.error('Error highlighting new product', error);
  }
};

export {
  fetchProducts,
  highlightProduct,
};
