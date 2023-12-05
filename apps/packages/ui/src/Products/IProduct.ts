interface Image {
  imageUrl: string
}
export interface Value {
  id: string
  value: string
}

export interface Option {
  id: string
  name: string
  values: Value[]
}

interface SelectedOption {
  [key: Option['id']]: Value['id']
}

export interface Variant {
  variantValues: any[]
  id: string
  externalUrl?: string
  limitPerOrder?: number
  images: Image[]
  price: number
  originalPrice: number
  options: SelectedOption
}

export interface Product {
  id: string
  skus: Variant[]
  name: string
  images: Image[]
  variants: Option[]
  price: number
  originalPrice: number
  description: string
}
