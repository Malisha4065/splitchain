"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (groupId: bigint) => void;
}

export function CreateGroupModal({ isOpen, onClose, onSuccess }: CreateGroupModalProps) {
  const { address } = useAccount();
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "SplitChain" });

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (!trimmed) return;

    if (!isValidAddress(trimmed)) {
      setError("Invalid Ethereum address");
      return;
    }

    if (trimmed.toLowerCase() === address?.toLowerCase()) {
      setError("You're automatically added as a member");
      return;
    }

    if (members.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      setError("Member already added");
      return;
    }

    setMembers([...members, trimmed]);
    setMemberInput("");
    setError("");
  };

  const removeMember = (addr: string) => {
    setMembers(members.filter(m => m !== addr));
  };

  const handleCreate = async () => {
    if (!address || !groupName) return;

    setIsCreating(true);
    setError("");

    try {
      await writeContractAsync({
        functionName: "createGroup",
        args: [groupName, members],
      });

      // Reset and close
      setGroupName("");
      setMembers([]);
      onClose();

      // TODO: Parse event to get group ID
      onSuccess?.(1n); // Placeholder
    } catch (err: any) {
      console.error("Failed to create group:", err);
      setError(err.message || "Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>

        <h3 className="font-bold text-xl mb-6">
          <span className="text-2xl mr-2">👥</span>
          Create New Group
        </h3>

        {/* Group Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Group Name</span>
          </label>
          <input
            type="text"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="e.g., Beach Trip 2026, Roommates..."
            className="input input-bordered"
          />
        </div>

        {/* Add Members */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Add Members (wallet addresses)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={memberInput}
              onChange={e => setMemberInput(e.target.value)}
              placeholder="0x..."
              className="input input-bordered flex-1"
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMember())}
            />
            <button type="button" onClick={addMember} className="btn btn-primary">
              Add
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error mt-2 py-2">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Members List */}
        <div className="mt-4">
          <p className="text-sm opacity-70 mb-2">Members ({members.length + 1}):</p>
          <div className="flex flex-wrap gap-2">
            {/* Current user */}
            <span className="badge badge-primary badge-lg">
              {address?.slice(0, 6)}...{address?.slice(-4)} (you)
            </span>

            {/* Added members */}
            {members.map(m => (
              <span key={m} className="badge badge-outline badge-lg gap-1">
                {m.slice(0, 6)}...{m.slice(-4)}
                <button type="button" onClick={() => removeMember(m)} className="text-error hover:text-error-focus">
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleCreate} className="btn btn-primary gap-2" disabled={isCreating || !groupName}>
            {isCreating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              <>
                <span>🚀</span>
                Create Group
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
}
