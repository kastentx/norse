import { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore the legends of Norse mythology through interactive storytelling. Discover gods, heroes, epic tales, and the Nine Realms with stunning visuals and animations.",
  openGraph: {
    title: "Norse Mythology Knowledge Base - Interactive Learning",
    description:
      "Immerse yourself in Norse mythology with interactive animations, parallax storytelling, and detailed explorations of gods, stories, and realms.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] gap-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-norse-gold animate-fade-in">
          Norse Mythology
        </h1>
        <p className="text-xl sm:text-2xl text-norse-stone animate-fade-in animation-delay-100">
          Explore the legends of gods, heroes, and the Nine Realms
        </p>
        <p className="text-base sm:text-lg text-norse-stone/80 max-w-2xl mx-auto animate-fade-in animation-delay-200">
          Immerse yourself in the rich tapestry of Norse mythology through
          interactive storytelling, stunning visuals, and animated explorations
          of legendary tales.
        </p>
      </section>

      {/* Navigation Cards */}
      <section
        className="w-full max-w-5xl animate-fade-in animation-delay-300"
        aria-label="Main sections"
      >
        <Navigation />
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl px-4 animate-fade-in animation-delay-400">
        <div className="text-center space-y-2">
          <div className="text-3xl" role="img" aria-label="Interactive">
            ✨
          </div>
          <h3 className="text-lg font-semibold text-norse-gold">Interactive</h3>
          <p className="text-sm text-norse-stone">
            Smooth animations and engaging interactions
          </p>
        </div>
        <div className="text-center space-y-2">
          <div className="text-3xl" role="img" aria-label="Educational">
            📚
          </div>
          <h3 className="text-lg font-semibold text-norse-gold">Educational</h3>
          <p className="text-sm text-norse-stone">
            Learn about Norse mythology and legends
          </p>
        </div>
        <div className="text-center space-y-2">
          <div className="text-3xl" role="img" aria-label="Accessible">
            ♿
          </div>
          <h3 className="text-lg font-semibold text-norse-gold">Accessible</h3>
          <p className="text-sm text-norse-stone">
            Built with accessibility and performance in mind
          </p>
        </div>
      </section>
    </div>
  );
}
