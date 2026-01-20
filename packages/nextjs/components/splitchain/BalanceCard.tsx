"use client";

import { useState } from "react";
import { MemberBadge } from "./MemberBadge";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface BalanceCardProps {
  groupId: bigint;
  creditor: string;
  amount: bigint;
  currentUserAddress?: string;
  onSettled?: () => void;
}

export function BalanceCard({ groupId, creditor, amount, onSettled }: BalanceCardProps) {
  const { address } = useAccount();
  const [isSettling, setIsSettling] = useState(false);

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "SplitChain" });

  const isCreditor = creditor.toLowerCase() === address?.toLowerCase();
  const amountEth = formatEther(amount);

  const handleSettle = async () => {
    if (!address || isCreditor) return;

    setIsSettling(true);
    try {
      await writeContractAsync({
        functionName: "settleDebt",
        args: [groupId, creditor],
        value: amount,
      });
      onSettled?.();
    } catch (error) {
      console.error("Settlement failed:", error);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div
      className={`card ${isCreditor ? "bg-success/10 border-success" : "bg-error/10 border-error"} border shadow-md`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isCreditor ? (
              <>
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-sm opacity-70">You are owed</p>
                  <p className="text-xl font-bold text-success">+{amountEth} ETH</p>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl">💸</span>
                <div>
                  <p className="text-sm opacity-70">You owe</p>
                  <MemberBadge address={creditor} size="sm" />
                  <p className="text-xl font-bold text-error">-{amountEth} ETH</p>
                </div>
              </>
            )}
          </div>

          {!isCreditor && (
            <button onClick={handleSettle} className="btn btn-primary btn-sm gap-2" disabled={isSettling}>
              {isSettling ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Settling...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Settle Now
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
