"use client";

import { useState } from "react";
import { getDisplayName, setDisplayName } from "~~/utils/displayNames";

interface MemberBadgeProps {
  address: string;
  isCurrentUser?: boolean;
  showEdit?: boolean;
  size?: "sm" | "md" | "lg";
}

export function MemberBadge({ address, isCurrentUser = false, showEdit = false, size = "md" }: MemberBadgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(getDisplayName(address));
  const [inputValue, setInputValue] = useState(name);

  const handleSave = () => {
    setDisplayName(address, inputValue);
    setName(inputValue);
    setIsEditing(false);
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="input input-bordered input-sm w-32"
          placeholder="Enter name"
          autoFocus
          onKeyDown={e => e.key === "Enter" && handleSave()}
        />
        <button onClick={handleSave} className="btn btn-primary btn-xs">
          Save
        </button>
        <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-xs">
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`badge ${isCurrentUser ? "badge-primary" : "badge-outline"} ${sizeClasses[size]} font-mono`}
        title={address}
      >
        {name}
        {isCurrentUser && <span className="ml-1 text-xs">(you)</span>}
      </span>
      {showEdit && (
        <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-xs opacity-50 hover:opacity-100">
          ✏️
        </button>
      )}
    </div>
  );
}
