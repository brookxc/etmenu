"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import RestaurantCard from "@/components/restaurant-card"
import type { Restaurant } from "@/lib/models"

export default function RestaurantBrowser({ restaurants }: { restaurants: Restaurant[] }) {
  const [query, setQuery] = useState("")

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <div className="max-w-md mx-auto relative mt-6">
        <Input
          type="search"
          placeholder="Search restaurants..."
          className="pl-10 bg-white/90 border-0 h-12 text-base rounded-full shadow-lg"
          aria-label="Search restaurants"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5"
          aria-hidden="true"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
            <p className="text-amber-800 mb-4">No restaurants found.</p>
          </div>
        )}
      </div>
    </>
  )
}
