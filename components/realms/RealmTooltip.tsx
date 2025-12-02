"use client";

import { motion } from "framer-motion";
import { Realm } from "@/types/realm";

interface RealmTooltipProps {
  realm: Realm;
  position: { x: number; y: number };
}

export default function RealmTooltip({ realm, position }: RealmTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none fixed z-50 max-w-sm rounded-lg border border-norse-gold/30 bg-norse-gray-900/95 p-4 shadow-xl backdrop-blur-sm"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 20}px`,
        transform: "translateY(-50%)",
      }}
    >
      {/* Realm Name */}
      <h3 className="mb-2 font-norse text-xl text-norse-gold">{realm.name}</h3>

      {/* Level Badge */}
      <div className="mb-3 inline-flex items-center rounded-full bg-norse-gray-800 px-3 py-1 text-xs font-medium text-norse-gray-300">
        <span
          className="mr-2 h-2 w-2 rounded-full"
          style={{ backgroundColor: realm.mapRegion.color }}
        />
        {realm.location.level.charAt(0).toUpperCase() +
          realm.location.level.slice(1)}{" "}
        Realm
      </div>

      {/* Brief Description */}
      <p className="mb-3 text-sm text-norse-gray-300">
        {realm.description.substring(0, 150)}...
      </p>

      {/* Inhabitants */}
      {realm.inhabitants.primaryTypes.length > 0 && (
        <div className="mb-2">
          <span className="text-xs font-semibold text-norse-gold">
            Inhabitants:
          </span>
          <span className="ml-2 text-xs text-norse-gray-400">
            {realm.inhabitants.primaryTypes.slice(0, 3).join(", ")}
          </span>
        </div>
      )}

      {/* Environment */}
      <div className="text-xs text-norse-gray-400">
        <span className="font-semibold text-norse-gold">Environment:</span>{" "}
        {realm.characteristics.environment.substring(0, 80)}
      </div>

      {/* Click to explore hint */}
      <div className="mt-3 border-t border-norse-gold/20 pt-2 text-center text-xs text-norse-gray-500">
        Click to explore this realm
      </div>
    </motion.div>
  );
}
