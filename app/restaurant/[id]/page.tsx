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
              image: item.image || "", // Don't set a default placeholder
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
        image: item.image || "", // Don't set a default placeholder
      }))
    }

    // If no menuCategories or menuItems in restaurant document, try to find menu items in menuItems collection
    console.log("No menu items found in restaurant document, checking menuItems collection")
    const menuItems = await db.collection("menuItems").find({ restaurantId: restaurantId }).toArray()

    console.log(`Found ${menuItems.length} menu items in menuItems collection for restaurant ${restaurantId}`)
    return JSON.parse(
      JSON.stringify(
        menuItems.map((item: any) => ({
          ...item,
          image: item.image || "", // Don't set a default placeholder
        })),
      ),
    )
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
    <div className="min-h-screen bg-gray-100 bg-[url('/menu-background.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="bg-white/80 backdrop-blur-sm min-h-screen">
        {/* Restaurant Header */}
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center mb-8">
            <div
              className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-md mb-4 border-4"
              style={{ borderColor: lighterThemeColor }}
            >
              {restaurant.logo ? (
                <Image
                  src={restaurant.logo || "/placeholder.svg"}
                  alt={`${restaurant.name} logo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 128px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100"></div>
              )}
            </div>

            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-wide" style={{ color: themeColor }}>
                {restaurant.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{restaurant.location}</p>
            </div>
          </div>

          {/* Menu Title */}
          <div className="text-center mb-3">
            <h2
              className="text-xl sm:text-5xl font-serif font-normal tracking-wide"
              style={{ color: darkerThemeColor }}
            >
              Our Menu
            </h2>
          </div>

          {/* Menu Content */}
          {menuItems.length > 0 ? (
            <MenuTabs
              categories={categories}
              menuItems={menuItems}
              themeColor={themeColor}
              lighterThemeColor={lighterThemeColor}
              darkerThemeColor={darkerThemeColor}
            />
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-md mx-auto">
              <p style={{ color: themeColor }}>No menu items available for this restaurant.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
