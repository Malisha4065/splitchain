"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface User {
  address: string;
  displayName: string;
  avatarUrl?: string | null;
}

interface ProfileSetupModalProps {
  onComplete?: (user: User) => void;
}

export function ProfileSetupModal({ onComplete }: ProfileSetupModalProps) {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user exists in DB when wallet connects
  useEffect(() => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const res = await fetch(`/api/users?address=${address}`);
        if (res.ok) {
          // User exists - don't show modal
          setIsOpen(false);
        } else if (res.status === 404) {
          // User doesn't exist - show modal
          setIsOpen(true);
          // Pre-fill with a suggested name
          setDisplayName(`User ${address.slice(0, 6)}`);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [address, isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !displayName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          displayName: displayName.trim(),
          avatarUrl: avatarUrl.trim() || null,
        }),
      });

      if (res.ok) {
        const user = await res.json();
        setIsOpen(false);
        onComplete?.(user);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything while loading or if user exists
  if (isLoading || !isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-2xl mb-2 text-center">
          <span className="text-4xl block mb-2">👋</span>
          Welcome to SplitChain!
        </h3>
        <p className="text-center opacity-70 mb-6">Set up your profile to get started</p>

        <form onSubmit={handleSubmit}>
          {/* Wallet Address (read-only) */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Your Wallet</span>
            </label>
            <div className="input input-bordered flex items-center gap-2 bg-base-200">
              <span className="text-success">✓</span>
              <span className="font-mono text-sm truncate">{address}</span>
            </div>
            <label className="label">
              <span className="label-text-alt opacity-60">Auto-connected via Scaffold-ETH</span>
            </label>
          </div>

          {/* Display Name */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Display Name *</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Enter your name..."
              className="input input-bordered"
              required
              autoFocus
            />
            <label className="label">
              <span className="label-text-alt opacity-60">This is how others will see you in groups</span>
            </label>
          </div>

          {/* Avatar URL (optional) */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Avatar URL</span>
              <span className="label-text-alt">(optional)</span>
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="input input-bordered"
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full gap-2" disabled={isSubmitting || !displayName.trim()}>
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating Profile...
              </>
            ) : (
              <>
                <span>🚀</span>
                Get Started
              </>
            )}
          </button>
        </form>
      </div>
      {/* No backdrop click to close - must complete profile */}
      <div className="modal-backdrop bg-black/70"></div>
    </div>
  );
}
