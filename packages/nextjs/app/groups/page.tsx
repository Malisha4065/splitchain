"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { CreateGroupModal } from "~~/components/splitchain";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const GroupsPage: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user's groups
  const { data: userGroupIds, refetch: refetchGroups } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getUserGroups",
    args: [address],
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">🔗</span>
        <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
        <p className="text-center opacity-70 max-w-md">
          Connect your wallet to view your expense groups and start splitting costs with friends.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Groups</h1>
          <p className="opacity-70">Manage your expense splitting groups</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
          <span className="text-lg">+</span>
          Create Group
        </button>
      </div>

      {/* Groups Grid */}
      {!userGroupIds || userGroupIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-base-200 rounded-2xl">
          <span className="text-6xl">📭</span>
          <h2 className="text-xl font-semibold">No Groups Yet</h2>
          <p className="text-center opacity-70 max-w-md">
            Create your first group to start splitting expenses with friends, roommates, or travel buddies.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary mt-4">
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGroupIds.map((groupId: bigint) => (
            <GroupCard key={groupId.toString()} groupId={groupId} userAddress={address} />
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetchGroups();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

// Group Card Component
function GroupCard({ groupId, userAddress }: { groupId: bigint; userAddress?: string }) {
  const { data: groupData } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getGroup",
    args: [groupId],
  });

  const { data: balance } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getMemberBalance",
    args: [groupId, userAddress],
  });

  if (!groupData) {
    return (
      <div className="card bg-base-200 animate-pulse">
        <div className="card-body">
          <div className="h-6 bg-base-300 rounded w-3/4"></div>
          <div className="h-4 bg-base-300 rounded w-1/2 mt-2"></div>
        </div>
      </div>
    );
  }

  const [name, , , memberCount] = groupData;
  const balanceNum = balance ? Number(balance) : 0;
  const isPositive = balanceNum > 0;
  const isNegative = balanceNum < 0;

  return (
    <Link href={`/groups/${groupId}`}>
      <div className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer shadow-lg hover:shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            <span className="text-2xl">👥</span>
            {name}
          </h2>

          <div className="flex items-center gap-2 text-sm opacity-70">
            <span>👤 {memberCount.toString()} members</span>
          </div>

          {/* Balance */}
          <div className="mt-4">
            <p className="text-xs opacity-50">Your balance</p>
            <p
              className={`text-xl font-bold ${
                isPositive ? "text-success" : isNegative ? "text-error" : "text-base-content"
              }`}
            >
              {isPositive && "+"}
              {balance ? formatEther(balance < 0n ? -balance : balance) : "0"} ETH
              {isNegative && " (you owe)"}
            </p>
          </div>

          <div className="card-actions justify-end mt-2">
            <span className="btn btn-ghost btn-sm">View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GroupsPage;
