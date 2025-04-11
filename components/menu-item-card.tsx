import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { MenuItem } from "@/lib/models"
import { formatPrice } from "@/lib/utils"

interface MenuItemCardProps {
  item: MenuItem
  themeColor: string
  darkerThemeColor: string
}

export default function MenuItemCard({ item, themeColor, darkerThemeColor }: MenuItemCardProps) {
  return (
    <Card key={item._id} className="overflow-hidden h-full border-none shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-row h-full">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 bg-white flex-shrink-0 rounded-l-lg overflow-hidden">
          {item.image ? (
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-white"></div>
          )}
        </div>

        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-base sm:text-lg" style={{ color: darkerThemeColor }}>
              {item.name}
            </h3>
            <span className="font-bold text-sm sm:text-base ml-2" style={{ color: themeColor }}>
              {formatPrice(item.price)}
            </span>
          </div>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm flex-grow" style={{ color: `${darkerThemeColor}CC` }}>
            {item.description}
          </p>
        </CardContent>
      </div>
    </Card>
  )
}
