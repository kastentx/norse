import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUserFavorites } from "@/lib/data/favorites";
import { getGodById } from "@/lib/data/gods";
import { getRealmById } from "@/lib/data/realms";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { User, Heart, Calendar, ExternalLink } from "lucide-react";

/**
 * Profile Page
 * 
 * Shows user information and their favorites.
 * Protected by middleware - redirects to sign in if not authenticated.
 */
export default async function ProfilePage() {
  const session = await auth();

  // This should be handled by middleware, but double-check
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  // Fetch user's favorites
  const favorites = await getUserFavorites(session.user.id);

  // Fetch details for favorite gods
  const favoriteGodDetails = await Promise.all(
    favorites.favoriteGods.map(async (id) => {
      const god = await getGodById(id);
      return god;
    })
  );
  const validGods = favoriteGodDetails.filter(Boolean);

  // Fetch details for favorite realms
  const favoriteRealmDetails = favorites.favoriteRealms
    .map((id) => getRealmById(id))
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: "Profile", href: "/profile" }]}
      />

      {/* Profile Header */}
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-norse-night/50 rounded-lg border border-norse-stone/20">
        {/* Avatar */}
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "Profile picture"}
            width={96}
            height={96}
            className="rounded-full border-2 border-norse-gold"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-norse-gold/20 flex items-center justify-center border-2 border-norse-gold">
            <User size={40} className="text-norse-gold" />
          </div>
        )}

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-norse-gold">
            {session.user.name || "Norse Enthusiast"}
          </h1>
          {session.user.email && (
            <p className="text-norse-stone mt-1">{session.user.email}</p>
          )}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-sm text-norse-stone/70">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-400" />
              <span>{favorites.favoriteGods.length + favorites.favoriteRealms.length} favorites</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Joined {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Favorite Gods */}
      <section id="favorites">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-norse-gold flex items-center gap-2">
            <Heart size={20} className="text-red-400" />
            Favorite Gods
            <span className="text-sm font-normal text-norse-stone">
              ({validGods.length})
            </span>
          </h2>
          <Link
            href="/gods"
            className="text-sm text-norse-stone hover:text-norse-gold transition-colors flex items-center gap-1"
          >
            Browse all
            <ExternalLink size={12} />
          </Link>
        </div>

        {validGods.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {validGods.map((god) => (
              <div
                key={god!.id}
                className="group relative p-4 bg-norse-night/50 rounded-lg border border-norse-stone/20 hover:border-norse-gold/50 transition-colors"
              >
                <Link href={`/gods/${god!.id}`} className="block">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={god!.imageUrl}
                        alt={god!.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-norse-gold truncate group-hover:text-norse-gold/80">
                        {god!.name}
                      </h3>
                      {god!.title && (
                        <p className="text-sm text-norse-stone truncate">
                          {god!.title}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="absolute top-2 right-2">
                  <FavoriteButton
                    type="god"
                    id={god!.id}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyFavoritesCard
            href="/gods"
            message="You haven't added any favorite gods yet."
            cta="Explore the pantheon"
          />
        )}
      </section>

      {/* Favorite Realms */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-norse-gold flex items-center gap-2">
            <Heart size={20} className="text-red-400" />
            Favorite Realms
            <span className="text-sm font-normal text-norse-stone">
              ({favoriteRealmDetails.length})
            </span>
          </h2>
          <Link
            href="/realms"
            className="text-sm text-norse-stone hover:text-norse-gold transition-colors flex items-center gap-1"
          >
            Browse all
            <ExternalLink size={12} />
          </Link>
        </div>

        {favoriteRealmDetails.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteRealmDetails.map((realm) => (
              <div
                key={realm!.id}
                className="group relative p-4 bg-norse-night/50 rounded-lg border border-norse-stone/20 hover:border-norse-gold/50 transition-colors"
              >
                <Link href={`/realms#${realm!.id}`} className="block">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={realm!.imageUrl}
                        alt={realm!.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-norse-gold truncate group-hover:text-norse-gold/80">
                        {realm!.name}
                      </h3>
                      <p className="text-sm text-norse-stone truncate">
                        {realm!.description?.slice(0, 50)}...
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="absolute top-2 right-2">
                  <FavoriteButton
                    type="realm"
                    id={realm!.id}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyFavoritesCard
            href="/realms"
            message="You haven't added any favorite realms yet."
            cta="Explore the Nine Realms"
          />
        )}
      </section>
    </div>
  );
}

function EmptyFavoritesCard({
  href,
  message,
  cta,
}: {
  href: string;
  message: string;
  cta: string;
}) {
  return (
    <div className="p-6 text-center bg-norse-night/30 rounded-lg border border-dashed border-norse-stone/30">
      <p className="text-norse-stone mb-3">{message}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-norse-gold text-norse-night rounded-lg hover:bg-norse-gold/90 transition-colors"
      >
        {cta}
        <ExternalLink size={14} />
      </Link>
    </div>
  );
}
