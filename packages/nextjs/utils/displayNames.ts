/**
 * Display name utilities
 */

/**
 * Shorten an Ethereum address for display
 */
export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Deprecated: Local storage names are no longer used.
// These are kept to avoid breaking other imports temporarily, but should be removed.
export const getDisplayName = (address: string) => shortenAddress(address);
export const setDisplayName = (_address: string, _name: string) => {}; // eslint-disable-line @typescript-eslint/no-unused-vars
export const getDisplayNames = () => ({});
