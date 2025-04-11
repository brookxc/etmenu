import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-amber-900">404 - Not Found</h1>
      <p className="text-amber-700 mb-8 max-w-md">
        The restaurant you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild className="bg-amber-600 hover:bg-amber-700">
        <Link href="/">Return to ETMenu</Link>
      </Button>
    </div>
  )
}
