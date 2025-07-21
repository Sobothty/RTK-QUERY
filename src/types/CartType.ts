export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}
