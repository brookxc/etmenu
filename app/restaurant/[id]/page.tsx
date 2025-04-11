import { notFound } from "next/navigation"
import Image from "next/image"
import type { Restaurant, MenuItem } from "@/lib/models"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import MenuTabs from "./menu-tabs"
import type { Metadata } from "next"
import { generateLighterColor, generateDarkerColor } from "@/lib/utils"
import { unstable_noStore } from "next/cache"

// Add dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const restaurant = await getRestaurant(params.id)

  if (!restaurant) {
    return {
      title: "Restaurant Not Found - ETMenu",
      description: "The restaurant you're looking for doesn't exist or may have been removed.",
    }
  }

  return {
    title: `${restaurant.name} - ETMenu`,
    description: restaurant.description,
  }
}

/**
 * Fetches a restaurant by ID
 * @param id - Restaurant ID
 * @returns Restaurant object or null if not found
 */
async function getRestaurant(id: string): Promise<Restaurant | null> {
  // Disable caching to ensure fresh data
  unstable_noStore()

  try {
    const db = await getDatabase()
    // Only fetch restaurant if it's not locked
    const restaurant = await db.collection("restaurants").findOne({
      _id: new ObjectId(id),
      $or: [{ locked: { $exists: false } }, { locked: false }],
    })

    if (!restaurant) {
      console.log(`Restaurant ${id} not found or is locked`)
      return null
    }

    return JSON.parse(JSON.stringify(restaurant))
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return null
  }
}

/**
 * Fetches menu items for a restaurant
 * @param restaurantId - Restaurant ID
 * @returns Array of menu items
 */
async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  // Disable caching to ensure fresh data
  unstable_noStore()

  try {
    const db = await getDatabase()
    const restaurant = await getRestaurant(restaurantId)

    if (!restaurant) return []

    // Check if the restaurant has menuCategories
    if (restaurant.menuCategories && Array.isArray(restaurant.menuCategories)) {
      console.log(`Found menuCategories in restaurant document: ${restaurant.menuCategories.length} categories`)

      // Extract menu items from menuCategories
      const menuItems: MenuItem[] = []

      restaurant.menuCategories.forEach((category: any, categoryIndex: number) => {
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item: any, itemIndex: number) => {
            menuItems.push({
              _id: item._id || `item-${categoryIndex}-${itemIndex}`,
              restaurantId: restaurantId,
              name: item.name || "Unnamed Item",
              description: item.description || "",
              price: item.price || 0,
              image: item.image || "/placeholder.svg",
              category: category.name || "Uncategorized",
            })
          })
        }
      })

      return menuItems
    }

    // Check if the restaurant has menuItems directly
    if (restaurant.menuItems && Array.isArray(restaurant.menuItems)) {
      console.log(`Found ${restaurant.menuItems.length} menu items directly in restaurant document`)
      return restaurant.menuItems.map((item: any) => ({
        ...item,
        restaurantId: restaurantId,
      }))
    }

    // If no menuCategories or menuItems in restaurant document, try to find menu items in menuItems collection
    console.log("No menu items found in restaurant document, checking menuItems collection")
    const menuItems = await db.collection("menuItems").find({ restaurantId: restaurantId }).toArray()

    console.log(`Found ${menuItems.length} menu items in menuItems collection for restaurant ${restaurantId}`)
    return JSON.parse(JSON.stringify(menuItems))
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return []
  }
}

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurant(params.id)

  if (!restaurant) {
    notFound()
  }

  const menuItems = await getMenuItems(params.id)

  console.log(`Restaurant: ${restaurant.name}, Menu Items: ${menuItems.length}`)

  // Get unique categories
  const categories = Array.from(new Set(menuItems.map((item) => item.category)))

  // Default theme color if not provided
  const themeColor = restaurant.themeColor || "#D97706" // Default to amber-600 if no theme color
  const lighterThemeColor = generateLighterColor(themeColor, 0.15)
  const darkerThemeColor = generateDarkerColor(themeColor)

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      {/* Restaurant Header with dynamic theme color */}
      <div
        className="text-white"
        style={{
          background: `linear-gradient(to right, ${themeColor}, ${darkerThemeColor})`,
        }}
      >
        <div className="container mx-auto py-4 sm:py-12 px-4">
          <div className="flex flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative h-28 w-28 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-full overflow-hidden bg-white flex-shrink-0 border-4 border-white shadow-lg">
              {restaurant.logo ? (
                <Image
                  src={restaurant.logo || "/placeholder.svg"}
                  alt={`${restaurant.name} logo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 192px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">{restaurant.name}</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/80">{restaurant.location}</p>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl text-white/90 line-clamp-3 sm:line-clamp-none">
                {restaurant.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto py-8 sm:py-10 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center" style={{ color: themeColor }}>
          Our Menu
        </h2>

        {menuItems.length > 0 ? (
          <MenuTabs
            categories={categories}
            menuItems={menuItems}
            themeColor={themeColor}
            lighterThemeColor={lighterThemeColor}
            darkerThemeColor={darkerThemeColor}
          />
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p style={{ color: themeColor }}>No menu items available for this restaurant.</p>
          </div>
        )}
      </div>
    </div>
  )
}
