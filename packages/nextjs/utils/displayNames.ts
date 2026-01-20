/**
 * Off-chain display name management for wallet addresses
 * Stored in localStorage for this MVP - in production, could use ENS or a backend
 */

const STORAGE_KEY = "splitchain_display_names";

export interface DisplayNameMap {
  [address: string]: string;
}

/**
 * Get all stored display names
 */
export function getDisplayNames(): DisplayNameMap {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Get display name for a specific address
 * Returns shortened address if no name set
 */
export function getDisplayName(address: string): string {
  const names = getDisplayNames();
  return names[address.toLowerCase()] || shortenAddress(address);
}

/**
 * Set display name for an address
 */
export function setDisplayName(address: string, name: string): void {
  if (typeof window === "undefined") return;
  const names = getDisplayNames();
  names[address.toLowerCase()] = name;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

/**
 * Remove display name for an address
 */
export function removeDisplayName(address: string): void {
  if (typeof window === "undefined") return;
  const names = getDisplayNames();
  delete names[address.toLowerCase()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

/**
 * Shorten an Ethereum address for display
 */
export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get display name or address for multiple addresses
 */
export function getDisplayNamesForAddresses(addresses: string[]): DisplayNameMap {
  const names = getDisplayNames();
  const result: DisplayNameMap = {};
  addresses.forEach(addr => {
    result[addr] = names[addr.toLowerCase()] || shortenAddress(addr);
  });
  return result;
}
