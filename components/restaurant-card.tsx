import Image from "next/image"
import Link from "next/link"
import type { Restaurant } from "@/lib/models"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-row transform group-hover:scale-[1.02] border border-gray-100">
        <div className="relative h-full w-28 sm:w-36 md:w-40 bg-gray-100 flex-shrink-0 overflow-hidden">
          {restaurant.logo ? (
            <Image
              src={restaurant.logo || "/placeholder.svg"}
              alt={`${restaurant.name} logo`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h2 className="text-lg font-bold text-amber-900 group-hover:text-amber-600 transition-colors">
            {restaurant.name}
          </h2>
          <p className="text-xs sm:text-sm text-amber-700 mt-1">{restaurant.location}</p>
          <p className="mt-2 text-xs sm:text-sm text-amber-800/80 line-clamp-2 flex-grow">{restaurant.description}</p>
          <div className="mt-2 text-amber-600 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
            View Menu
            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
