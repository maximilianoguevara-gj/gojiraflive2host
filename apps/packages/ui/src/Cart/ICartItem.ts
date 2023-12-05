import { Product, Variant } from '../Products/IProduct';

export interface ICartItem extends Variant {
  product: Product
  quantity: number
}
