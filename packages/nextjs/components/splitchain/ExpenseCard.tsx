"use client";

import { MemberBadge } from "./MemberBadge";
import { formatEther } from "viem";

interface ExpenseCardProps {
  expense: {
    payer: string;
    amount: bigint;
    description: string;
    timestamp: bigint;
    participants: string[];
  };
  currentUserAddress?: string;
}

export function ExpenseCard({ expense, currentUserAddress }: ExpenseCardProps) {
  const { payer, amount, description, timestamp, participants } = expense;

  const date = new Date(Number(timestamp) * 1000);
  const sharePerPerson = amount / BigInt(participants.length);

  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title text-lg">{description}</h3>
            <p className="text-xs opacity-60">
              {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{formatEther(amount)} ETH</p>
            <p className="text-xs opacity-60">{formatEther(sharePerPerson)} each</p>
          </div>
        </div>

        {/* Payer */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm opacity-70">Paid by:</span>
          <MemberBadge
            address={payer}
            isCurrentUser={payer.toLowerCase() === currentUserAddress?.toLowerCase()}
            size="sm"
          />
        </div>

        {/* Participants */}
        <div className="mt-2">
          <p className="text-xs opacity-70 mb-1">Split between {participants.length} people:</p>
          <div className="flex flex-wrap gap-1">
            {participants.map(addr => (
              <MemberBadge
                key={addr}
                address={addr}
                isCurrentUser={addr.toLowerCase() === currentUserAddress?.toLowerCase()}
                size="sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
