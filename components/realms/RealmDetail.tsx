"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Realm } from "@/types/realm";
import { X } from "lucide-react";

interface RealmDetailProps {
  realm: Realm;
  onClose: () => void;
}

export default function RealmDetail({ realm, onClose }: RealmDetailProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-norse-gold/30 bg-gradient-to-b from-norse-gray-900 to-black shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-norse-gray-800/80 p-2 text-norse-gray-300 transition-colors hover:bg-norse-gray-700 hover:text-white"
            aria-label="Close realm details"
          >
            <X size={24} />
          </button>

          {/* Realm Image */}
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={realm.imageUrl}
              alt={realm.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-norse-gray-900 via-transparent to-transparent" />
            
            {/* Realm Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="mb-2 font-norse text-4xl text-norse-gold md:text-5xl">
                {realm.name}
              </h2>
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                  style={{
                    backgroundColor: `${realm.mapRegion.color}20`,
                    color: realm.mapRegion.color,
                    border: `1px solid ${realm.mapRegion.color}40`,
                  }}
                >
                  {realm.location.level.charAt(0).toUpperCase() +
                    realm.location.level.slice(1)}{" "}
                  Realm
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Description */}
            <section className="mb-8">
              <h3 className="mb-3 font-norse text-2xl text-norse-gold">
                About
              </h3>
              <p className="text-lg leading-relaxed text-norse-gray-300">
                {realm.description}
              </p>
            </section>

            {/* Characteristics Grid */}
            <section className="mb-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-norse-gold/20 bg-norse-gray-800/50 p-4">
                <h4 className="mb-2 font-norse text-lg text-norse-gold">
                  Environment
                </h4>
                <p className="text-sm text-norse-gray-300">
                  {realm.characteristics.environment}
                </p>
              </div>
              <div className="rounded-lg border border-norse-gold/20 bg-norse-gray-800/50 p-4">
                <h4 className="mb-2 font-norse text-lg text-norse-gold">
                  Culture
                </h4>
                <p className="text-sm text-norse-gray-300">
                  {realm.characteristics.culture}
                </p>
              </div>
              <div className="rounded-lg border border-norse-gold/20 bg-norse-gray-800/50 p-4">
                <h4 className="mb-2 font-norse text-lg text-norse-gold">
                  Significance
                </h4>
                <p className="text-sm text-norse-gray-300">
                  {realm.characteristics.significance}
                </p>
              </div>
            </section>

            {/* Inhabitants */}
            <section className="mb-8">
              <h3 className="mb-3 font-norse text-2xl text-norse-gold">
                Inhabitants
              </h3>
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold text-norse-gray-400">
                  Primary Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {realm.inhabitants.primaryTypes.map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-norse-gray-800 px-3 py-1 text-sm text-norse-gray-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              {realm.inhabitants.notableResidents.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-norse-gray-400">
                    Notable Residents
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {realm.inhabitants.notableResidents.map((godId) => (
                      <Link
                        key={godId}
                        href={`/gods/${godId}`}
                        className="rounded-full bg-norse-gold/20 px-3 py-1 text-sm text-norse-gold transition-colors hover:bg-norse-gold/30"
                      >
                        {godId.charAt(0).toUpperCase() + godId.slice(1)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Connected Realms */}
            {realm.connections && realm.connections.length > 0 && (
              <section className="mb-8">
                <h3 className="mb-3 font-norse text-2xl text-norse-gold">
                  Connected Realms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {realm.connections.map((connectionId) => (
                    <span
                      key={connectionId}
                      className="rounded-full border border-norse-gold/30 bg-norse-gray-800/50 px-4 py-2 text-sm text-norse-gray-300"
                    >
                      {connectionId.charAt(0).toUpperCase() + connectionId.slice(1)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Related Stories */}
            {realm.stories.length > 0 && (
              <section>
                <h3 className="mb-3 font-norse text-2xl text-norse-gold">
                  Related Stories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {realm.stories.map((storyId) => (
                    <Link
                      key={storyId}
                      href={`/stories/${storyId}`}
                      className="rounded-full bg-norse-gold/20 px-4 py-2 text-sm text-norse-gold transition-colors hover:bg-norse-gold/30"
                    >
                      {storyId.charAt(0).toUpperCase() +
                        storyId.slice(1).replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
