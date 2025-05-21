export interface Restaurant {
  _id: string
  name: string
  logo: string
  coverPhoto?: string
  location: string
  description: string
  themeColor?: string
  locked?: boolean
  menuCategories?: any[]
  menuItems?: MenuItem[]
}

export interface MenuItem {
  _id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
}
