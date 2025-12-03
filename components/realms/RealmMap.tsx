"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useReducedMotion, PanInfo } from "framer-motion";
import { Realm } from "@/types/realm";
import RealmTooltip from "./RealmTooltip";

interface RealmMapProps {
  realms: Realm[];
  selectedRealm: Realm | null;
  onRealmSelect: (realm: Realm | null) => void;
}

export default function RealmMap({
  realms,
  selectedRealm,
  onRealmSelect,
}: RealmMapProps) {
  const [hoveredRealm, setHoveredRealm] = useState<Realm | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedRealmId, setFocusedRealmId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();
  const lastTouchDistance = useRef<number | null>(null);

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate paths on mount
  useEffect(() => {
    if (!prefersReducedMotion) {
      controls.start((i) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { duration: 1, delay: i * 0.1 },
          opacity: { duration: 0.3, delay: i * 0.1 },
        },
      }));
    }
  }, [controls, prefersReducedMotion]);

  // Zoom animation when realm is selected
  useEffect(() => {
    if (selectedRealm && !prefersReducedMotion) {
      setScale(2.5);
      const { x, y } = selectedRealm.location.coordinates;
      // Center the selected realm
      setPosition({ x: -(x - 50) * 2.5, y: -(y - 50) * 2.5 });
      
      controls.start({
        scale: 2.5,
        x: -(x - 50) * 2.5,
        y: -(y - 50) * 2.5,
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    } else if (!selectedRealm && !prefersReducedMotion) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      
      controls.start({
        scale: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    } else if (selectedRealm && prefersReducedMotion) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedRealm, controls, prefersReducedMotion]);

  // Handle pinch-to-zoom gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      lastTouchDistance.current = distance;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current) {
      const distance = getTouchDistance(e.touches);
      const scaleDelta = distance / lastTouchDistance.current;
      const newScale = Math.max(1, Math.min(4, scale * scaleDelta));
      
      setScale(newScale);
      lastTouchDistance.current = distance;
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
  };

  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0]!.clientX - touches[1]!.clientX;
    const dy = touches[0]!.clientY - touches[1]!.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle drag/pan gesture
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!selectedRealm) return; // Only allow panning when zoomed in
    
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    });
  };

  const handleRealmClick = (realm: Realm) => {
    if (selectedRealm?.id === realm.id) {
      onRealmSelect(null); // Deselect if clicking the same realm
    } else {
      onRealmSelect(realm);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, realm: Realm) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRealmClick(realm);
    }
  };

  return (
    <div className="relative">
      {/* SVG Map Container */}
      <motion.div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-norse-gold/30 bg-gradient-to-b from-norse-gray-900 to-black p-4 touch-none"
        animate={controls}
        drag={selectedRealm ? true : false}
        dragConstraints={containerRef}
        dragElastic={0.1}
        onDrag={handleDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: selectedRealm ? "grab" : "default",
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="h-auto w-full"
          role="img"
          aria-label="Interactive map of the Nine Realms"
        >
          {/* Background - Yggdrasil trunk */}
          <motion.line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="url(#trunk-gradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { pathLength: 1, opacity: 0.3 }
                : { pathLength: 1, opacity: 0.3 }
            }
            transition={{ duration: 1.5 }}
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="trunk-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B7355" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#5C4033" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3E2723" stopOpacity="0.3" />
            </linearGradient>

            {/* Gradient for text readability inside circles */}
            <linearGradient id="text-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.7" />
            </linearGradient>

            {/* Glow filters for each realm */}
            {realms.map((realm) => (
              <filter
                key={`glow-${realm.id}`}
                id={`glow-${realm.id}`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          {/* Realm Regions */}
          {realms.map((realm, index) => {
            const isHovered = hoveredRealm?.id === realm.id;
            const isSelected = selectedRealm?.id === realm.id;
            const isFocused = focusedRealmId === realm.id;
            const { x, y } = realm.location.coordinates;
            const radius = 11; // Smaller circle radius to fit container

            return (
              <motion.g 
                key={realm.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered && !prefersReducedMotion ? 1.08 : 1, 
                  opacity: 1 
                }}
                transition={{
                  scale: { duration: 0.15, ease: "easeOut" },
                  opacity: { duration: 0.3, delay: index * 0.05 },
                }}
                style={{ 
                  transformOrigin: `${x}px ${y}px`,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredRealm(realm)}
                onMouseLeave={() => setHoveredRealm(null)}
                onClick={() => handleRealmClick(realm)}
                onFocus={() => setFocusedRealmId(realm.id)}
                onBlur={() => setFocusedRealmId(null)}
                onKeyDown={(e) => handleKeyDown(e, realm)}
                tabIndex={0}
                role="button"
                aria-label={`${realm.name} - ${realm.description.substring(0, 100)}...`}
                aria-pressed={isSelected}
              >
                {/* Define clip path for circular realm */}
                <defs>
                  <clipPath id={`clip-${realm.id}`}>
                    <circle cx={x} cy={y} r={radius} />
                  </clipPath>
                </defs>

                {/* Realm circle with image fill */}
                <g clipPath={`url(#clip-${realm.id})`}>
                  {/* Background image that fills the circle */}
                  <image
                    href={realm.imageUrl}
                    x={x - radius}
                    y={y - radius}
                    width={radius * 2}
                    height={radius * 2}
                    preserveAspectRatio="xMidYMid slice"
                  />
                  {/* Dark gradient overlay for text readability */}
                  <rect
                    x={x - radius}
                    y={y + radius * 0.3}
                    width={radius * 2}
                    height={radius * 0.7}
                    fill="url(#text-gradient)"
                  />
                </g>

                {/* Border circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill="none"
                  stroke={realm.mapRegion.glowColor}
                  strokeWidth={isHovered || isSelected || isFocused ? 1 : 0.5}
                  style={{
                    filter: isHovered || isSelected || isFocused
                      ? `drop-shadow(0 0 3px ${realm.mapRegion.glowColor})`
                      : "none",
                    transition: "stroke-width 0.15s ease, filter 0.15s ease",
                  }}
                />

                {/* Realm label inside circle at bottom */}
                <text
                  x={x}
                  y={y + radius * 0.55}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="2.4"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                  style={{
                    filter: `drop-shadow(0 1px 1px rgba(0,0,0,0.9))`,
                  }}
                >
                  {realm.name}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      {/* Tooltip */}
      {hoveredRealm && !selectedRealm && (
        <RealmTooltip realm={hoveredRealm} position={mousePosition} />
      )}

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-norse-gray-400">
        {selectedRealm
          ? "Click the selected realm again to zoom out"
          : "Click on a realm to explore, hover for details"}
      </div>
    </div>
  );
}
