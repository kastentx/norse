/**
 * Cache-busting utility for static images
 * Adds a version parameter based on build time to force browser cache refresh
 */

// Build timestamp - regenerated on each build
const BUILD_VERSION = Date.now().toString(36);

/**
 * Adds cache-busting version to image URL
 * @param url - Original image URL
 * @returns URL with version parameter
 */
export function versionImageUrl(url: string): string {
  if (!url) return url;
  
  // Don't version external URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Add version parameter
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${BUILD_VERSION}`;
}

/**
 * Get the current build version
 */
export function getBuildVersion(): string {
  return BUILD_VERSION;
}
