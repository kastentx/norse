"use client";

import { useEffect, useState } from "react";

/**
 * Service Worker Registration Component
 * 
 * Registers the service worker and handles updates.
 * Shows a prompt when a new version is available.
 */
export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Only register in production or if explicitly enabled
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        
        setRegistration(reg);
        console.log("[SW] Service worker registered with scope:", reg.scope);

        // Check for updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New version available
                console.log("[SW] New version available");
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Check for updates periodically (every hour)
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);

      } catch (error) {
        console.error("[SW] Registration failed:", error);
      }
    };

    registerSW();

    // Handle controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // Reload the page to use the new service worker
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell the waiting SW to skip waiting
      registration.waiting.postMessage("skipWaiting");
    }
  };

  // Update notification banner
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-gold-500 text-norse-night p-4 rounded-lg shadow-lg z-50 animate-slide-up">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Update Available</p>
            <p className="text-sm opacity-80">
              A new version of the app is ready.
            </p>
          </div>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-norse-night text-gold-400 rounded-lg font-medium hover:bg-norse-night/80 transition-colors whitespace-nowrap"
          >
            Update Now
          </button>
        </div>
      </div>
    );
  }

  return null;
}
