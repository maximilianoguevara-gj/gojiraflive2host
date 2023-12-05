import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from './IProduct';
import { productsKeys } from './queries';
import { fetchProducts } from './productsService';
import { useCart } from '../Cart/useCart';
import { productsConfig } from './productsConfig';

interface Catalog {
  featuredProducts: Product['id'][]
  products: Product[]
}

interface IUseProducts {
  callId?: string
}

export const useProducts = ({ callId = undefined }: IUseProducts = {}) => {
  const { send: cartSend } = useCart();
  const { data: catalog, isLoading } = useQuery<Catalog>(
    productsKeys.all,
    () => fetchProducts(callId!),
    {
      refetchInterval: productsConfig.refreshInterval,
      enabled: !!callId,
      refetchOnWindowFocus: true,
      onSuccess(data) {
        cartSend({
          type: 'Products list changed',
          productsList: data.products,
        });
      },
    },
  );
  const [animateFeaturedProduct, setAnimateFeaturedProduct] = useState(false);

  const toogleFeatureProductAnimation = () => {
    setAnimateFeaturedProduct(true);
    setTimeout(() => {
      setAnimateFeaturedProduct(false);
    }, 500);
  };

  const findFeaturedProduct = (
    currentCatalog: Catalog | undefined,
  ) => {
    if (currentCatalog === undefined || currentCatalog.products === undefined) {
      return null;
    }

    return currentCatalog.products.find((product) => product.id === catalog?.featuredProducts[0]);
  };

  const featuredProduct = useMemo(() => findFeaturedProduct(catalog), [catalog]);

  useEffect(() => {
    toogleFeatureProductAnimation();
  }, [featuredProduct]);

  const getProductById = (productId: Product['id']) => catalog?.products.find((product) => product.id === productId);

  return {
    products: catalog?.products ?? [],
    featuredProduct,
    loading: isLoading,
    getProductById,
    animateFeaturedProduct,
  };
};
