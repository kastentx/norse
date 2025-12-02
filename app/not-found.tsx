import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] gap-8 text-center px-4">
      <div className="space-y-4">
        <h1 className="text-8xl font-bold text-norse-gold">404</h1>
        <h2 className="text-3xl font-semibold text-norse-stone">
          Lost in the Nine Realms
        </h2>
        <p className="text-lg text-norse-stone/80 max-w-md mx-auto">
          The page you seek has vanished like a vision from Odin&apos;s ravens.
          Perhaps it never existed, or has been claimed by the mists of Niflheim.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="primary" size="lg">
            Return Home
          </Button>
        </Link>
        <Link href="/gods">
          <Button variant="secondary" size="lg">
            Browse Gods
          </Button>
        </Link>
      </div>

      <div className="text-6xl animate-pulse" role="img" aria-label="Lost">
        🌫️
      </div>
    </div>
  );
}
