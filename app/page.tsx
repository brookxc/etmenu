import { Search, Mail, MapPin, Phone } from "lucide-react"
import type { Restaurant } from "@/lib/models"
import { getDatabase } from "@/lib/mongodb"
import { Input } from "@/components/ui/input"
import RestaurantCard from "@/components/restaurant-card"
import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { unstable_noStore } from "next/cache"

export const metadata: Metadata = {
  title: "ETMenu - Discover Great Restaurants in Ethiopia",
  description: "Find and explore the best restaurants and their delicious menus across Ethiopia",
  keywords: "restaurants, Ethiopia, food, dining, menus, Addis Ababa",
}

/**
 * Fetches all restaurants from the database
 * @returns Array of restaurants
 */
async function getRestaurants(): Promise<Restaurant[]> {
  // Disable caching to ensure fresh data
  unstable_noStore()

  try {
    const db = await getDatabase()
    // Only fetch restaurants that are not locked
    const restaurants = await db
      .collection("restaurants")
      .find({
        $or: [{ locked: { $exists: false } }, { locked: false }],
      })
      .sort({ updatedAt: -1 }) // Sort by most recently updated
      .toArray()

    console.log(`Found ${restaurants.length} unlocked restaurants`)
    return JSON.parse(JSON.stringify(restaurants))
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return []
  }
}

export default async function Home() {
  const restaurants = await getRestaurants()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-500 to-amber-700 text-white">
        <div className="container mx-auto py-16 px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">ETMenu</h1>
            <p className="text-xl mb-8">Discover the finest restaurants and explore their delicious menus</p>

            {/* Search bar */}
            <div className="max-w-md mx-auto relative">
              <Input
                type="search"
                placeholder="Search restaurants..."
                className="pl-10 bg-white/90 border-0 h-12 text-base rounded-full shadow-lg"
                aria-label="Search restaurants"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Listings */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-amber-900 text-center">Popular Restaurants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}

          {restaurants.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
              <p className="text-amber-800 mb-4">No restaurants found.</p>
            </div>
          )}
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-amber-900">About Us</h2>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <p className="text-amber-800 mb-4">
                ETMenu is Ethiopia&apos;s premier restaurant directory, connecting food lovers with the best dining
                experiences across the country.
              </p>
              <p className="text-amber-800 mb-4">
                Our mission is to showcase the rich culinary diversity of Ethiopia, from traditional injera and wot to
                international cuisines, all in one convenient platform.
              </p>
              <p className="text-amber-800">
                Founded in 2025, we&apos;ve partnered with hundreds of restaurants to provide accurate menus, prices, and
                information to help you discover your next favorite meal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-amber-900 text-center">Contact Us</h2>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-amber-600 text-white p-8">
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5" aria-hidden="true" />
                  <p>Bole, Addis Ababa, Ethiopia</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" aria-hidden="true" />
                  <p>+251 936 965 694</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" aria-hidden="true" />
                  <p>+251 941 960 621</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3" aria-hidden="true" />
                  <p>info@etmenu.com</p>
                </div>
              </div>
              <div className="mt-8">
                <p className="mb-4">Follow us on social media:</p>
                <div className="flex space-x-4">
                  {/* Social media icons would go here */}
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="sr-only">Facebook</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="sr-only">Instagram</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="sr-only">Twitter</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <h3 className="text-xl font-semibold mb-4 text-amber-900">Send us a message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 ETMenu. All rights reserved.</p>
          <p className="mt-2 text-amber-200 text-sm">The ultimate restaurant directory in Ethiopia</p>
        </div>
      </footer>
    </div>
  )
}
