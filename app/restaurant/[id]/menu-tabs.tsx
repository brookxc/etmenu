"use client"

import { useState, useRef, useEffect, memo } from "react"
import type { MenuItem } from "@/lib/models"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

interface MenuTabsProps {
  categories: string[]
  menuItems: MenuItem[]
  themeColor: string
  lighterThemeColor: string
  darkerThemeColor: string
}

// Memoized category tab component for better performance
const CategoryTab = memo(
  ({
    category,
    isActive,
    onClick,
    themeColor,
  }: {
    category: string
    isActive: boolean
    onClick: () => void
    themeColor: string
  }) => (
    <button
      data-category={category}
      onClick={onClick}
      className={`px-2 py-1 text-xs font-medium transition-all relative whitespace-nowrap ${
        isActive ? "text-white" : "bg-gray-900 text-white hover:bg-gray-800"
      }`}
      style={isActive ? { backgroundColor: themeColor } : {}}
      aria-selected={isActive}
      role="tab"
    >
      {category}
    </button>
  ),
)

CategoryTab.displayName = "CategoryTab"

export default function MenuTabs({
  categories,
  menuItems,
  themeColor,
  lighterThemeColor,
  darkerThemeColor,
}: MenuTabsProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || "")
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // Initialize section refs for each category
  useEffect(() => {
    categories.forEach((category) => {
      if (!sectionRefs.current[category]) {
        sectionRefs.current[category] = null
      }
    })
  }, [categories])

  // Scroll to category section when tab is clicked
  const scrollToCategory = (category: string) => {
    const sectionRef = sectionRefs.current[category]
    if (sectionRef) {
      isScrolling.current = true
      // Get the header height to offset the scroll position
      const headerOffset = 100 // Adjust based on your header height
      const sectionPosition = sectionRef.getBoundingClientRect().top
      const offsetPosition = sectionPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Reset the isScrolling flag after animation completes
      setTimeout(() => {
        isScrolling.current = false
      }, 500)
    }
  }

  // Update active category based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || isScrolling.current) return

      const scrollPosition = window.scrollY + 100 // Offset for better UX

      // Find which section is currently in view
      let currentCategory = categories[0]
      for (const category of categories) {
        const section = sectionRefs.current[category]
        if (section) {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY
          const sectionBottom = sectionTop + section.offsetHeight

          // Check if we're within this section (with some buffer at the top)
          if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionBottom) {
            currentCategory = category
            break // Found the current section, no need to check others
          }
        }
      }

      if (currentCategory !== activeCategory) {
        setActiveCategory(currentCategory)

        // Scroll the tab into view in the tabs container
        const activeTab = document.querySelector(`[data-category="${currentCategory}"]`)
        if (activeTab && tabsContainerRef.current) {
          const tabsContainer = tabsContainerRef.current
          const tabPosition = (activeTab as HTMLElement).offsetLeft
          const containerWidth = tabsContainer.offsetWidth
          const tabWidth = (activeTab as HTMLElement).offsetWidth

          tabsContainer.scrollTo({
            left: tabPosition - containerWidth / 2 + tabWidth / 2,
            behavior: "smooth",
          })
        }
      }
    }

    // Use requestAnimationFrame for smoother scrolling
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", scrollListener)
    return () => window.removeEventListener("scroll", scrollListener)
  }, [activeCategory, categories])

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Category tabs - smaller and scrollable */}
      <div
        className="sticky top-0 z-10 bg-white/90 backdrop-blur-md py-1 border-b"
        style={{ borderColor: `${lighterThemeColor}` }}
        role="tablist"
        aria-label="Menu Categories"
      >
        <div ref={tabsContainerRef} className="flex overflow-x-auto scrollbar-hide gap-0.5 px-2 max-w-full">
          {categories.map((category) => (
            <CategoryTab
              key={category}
              category={category}
              isActive={activeCategory === category}
              onClick={() => {
                setActiveCategory(category)
                scrollToCategory(category)
              }}
              themeColor={themeColor}
            />
          ))}
        </div>
      </div>

      {/* Menu content - now showing all categories for scrolling */}
      <div ref={contentRef} className="bg-white shadow-sm rounded-sm p-3 mt-2">
        {categories.map((category) => (
          <div
            key={category}
            ref={(el) => {
              sectionRefs.current[category] = el
            }}
            className="mb-6 last:mb-0"
            role="tabpanel"
            id={`category-${category}`}
            aria-labelledby={`tab-${category}`}
          >
            {/* Category header */}
            <h3
              className="text-x font-bold text-center uppercase tracking-wider mb-3 pb-1 border-b"
              style={{ color: themeColor, borderColor: lighterThemeColor }}
            >
              {category}
            </h3>

            {/* Menu items */}
            <div className="space-y-2">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-start pb-2 border-b"
                    style={{ borderColor: `${lighterThemeColor}30` }}
                  >
                    {/* Show image if it exists */}
                    {item.image && (
                      <div className="relative h-10 w-10 mr-2 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-black">{item.name}</h4>
                      {item.description && (
                        <p className="text-[10px] text-gray-600 mt-0.5 leading-tight">{item.description}</p>
                      )}
                    </div>
                    <div className="text-xs font-bold ml-2 whitespace-nowrap" style={{ color: themeColor }}>
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
