"use client"

import { useState, useRef, useEffect, memo } from "react"
import type { MenuItem } from "@/lib/models"
import MenuItemCard from "@/components/menu-item-card"

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
    lighterThemeColor,
  }: {
    category: string
    isActive: boolean
    onClick: () => void
    themeColor: string
    lighterThemeColor: string
  }) => (
    <button
      data-category={category}
      onClick={onClick}
      style={{
        backgroundColor: isActive ? themeColor : "#f1f1f1",
        color: isActive ? "white" : "#333",
        borderColor: themeColor,
      }}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
        isActive ? "text-white shadow-md transform scale-105" : "hover:text-white border shadow-inner"
      }`}
      onMouseOver={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = lighterThemeColor
          e.currentTarget.style.color = "#333"
        }
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "#f1f1f1"
          e.currentTarget.style.color = "#333"
        }
      }}
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
      const headerOffset = 80 // Adjust based on your header height
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
    <div className="relative">
      {/* Sticky category tabs with theme color */}
      <div
        className="sticky top-0 z-10 pt-2 pb-3 shadow-sm"
        style={{ backgroundColor: "#f8f5f2" }}
        role="tablist"
        aria-label="Menu Categories"
      >
        <div ref={tabsContainerRef} className="flex overflow-x-auto scrollbar-hide px-2">
          <div className="flex space-x-2 mx-auto">
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
                lighterThemeColor={lighterThemeColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Continuous scrolling menu content */}
      <div ref={contentRef} className="mt-4">
        {categories.map((category) => (
          <div
            key={category}
            ref={(el) => {
              sectionRefs.current[category] = el
            }}
            
            className="mb-10"
            role="tabpanel"
            id={`category-${category}`}
            aria-labelledby={`tab-${category}`}
          >
            {/* Category header with sticky behavior within its section */}
            <div
              className="bg-[#f8f5f2] py-2 mb-4 sticky -top-1 z-[5]"
              style={{ top: "60px" }} // Position just below the tabs
            >
              <h3
                className="text-xl font-bold pl-2 pb-2 border-b-2"
                style={{
                  color: themeColor,
                  borderColor: `${themeColor}40`, // 25% opacity border
                }}
              >
                {category}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    themeColor={themeColor}
                    darkerThemeColor={darkerThemeColor}
                  />
                ))}
            </div>

            {/* Visual separator between categories */}
            <div
              className="h-16 mt-8 mb-2 flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom, transparent, ${lighterThemeColor} 50%, transparent)`,
              }}
            >
              <div className="w-1/3 h-0.5 rounded-full" style={{ backgroundColor: `${themeColor}60` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
