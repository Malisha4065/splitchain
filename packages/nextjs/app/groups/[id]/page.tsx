"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { AddExpenseForm, BalanceCard, ExpenseCard, MemberBadge } from "~~/components/splitchain";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

// Type for simplified debts from contract
type SimplifiedDebt = {
  debtor: string;
  creditor: string;
  amount: bigint;
};

const GroupDetailPage: NextPage = () => {
  const params = useParams();
  const groupId = BigInt(params.id as string);
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"expenses" | "balances">("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Get group details
  const { data: groupData } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getGroup",
    args: [groupId],
  });

  // Get group members
  const { data: members } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getGroupMembers",
    args: [groupId],
  });

  // Get expense IDs
  const { data: expenseIds, refetch: refetchExpenses } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getGroupExpenses",
    args: [groupId],
  });

  // Get simplified debts
  const { data: debts, refetch: refetchDebts } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getSimplifiedDebts",
    args: [groupId],
  });

  // Get user's balance
  const { data: userBalance, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getMemberBalance",
    args: [groupId, address],
  });

  const refreshData = () => {
    refetchExpenses();
    refetchDebts();
    refetchBalance();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">🔗</span>
        <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
        <p className="opacity-70">Connect to view group details</p>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 opacity-70">Loading group...</p>
      </div>
    );
  }

  const [name, , , memberCount] = groupData;
  const balanceNum = userBalance ? Number(userBalance) : 0;

  // Filter debts where current user is debtor
  const myDebts = debts?.filter((d: SimplifiedDebt) => d.debtor.toLowerCase() === address?.toLowerCase()) || [];
  const owedToMe = debts?.filter((d: SimplifiedDebt) => d.creditor.toLowerCase() === address?.toLowerCase()) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/groups" className="btn btn-ghost btn-sm mb-4">
        ← Back to Groups
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">👥</span>
              {name}
            </h1>
            <p className="opacity-70 mt-2">{memberCount.toString()} members</p>
          </div>

          {/* User Balance Summary */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
              <p className="text-sm opacity-70">Your Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  balanceNum > 0 ? "text-success" : balanceNum < 0 ? "text-error" : "text-base-content"
                }`}
              >
                {balanceNum > 0 && "+"}
                {userBalance ? formatEther(userBalance < 0n ? -userBalance : userBalance) : "0"} ETH
              </p>
              <p className="text-xs opacity-50">
                {balanceNum > 0 ? "You're owed money 💰" : balanceNum < 0 ? "You owe money 💸" : "All settled up! ✅"}
              </p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="mt-6">
          <p className="text-sm opacity-70 mb-2">Members:</p>
          <div className="flex flex-wrap gap-2">
            {members?.map((member: string) => (
              <MemberBadge
                key={member}
                address={member}
                isCurrentUser={member.toLowerCase() === address?.toLowerCase()}
                showEdit={member.toLowerCase() === address?.toLowerCase()}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-200 p-1 w-fit">
        <button
          className={`tab ${activeTab === "expenses" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          📋 Expenses ({expenseIds?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === "balances" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("balances")}
        >
          💰 Balances ({myDebts.length + owedToMe.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "expenses" && (
        <div>
          {/* Add Expense Toggle */}
          <div className="mb-6">
            {!showAddExpense ? (
              <button onClick={() => setShowAddExpense(true)} className="btn btn-primary gap-2">
                <span className="text-lg">+</span>
                Add Expense
              </button>
            ) : (
              <div className="mb-6">
                <button onClick={() => setShowAddExpense(false)} className="btn btn-ghost btn-sm mb-4">
                  ✕ Cancel
                </button>
                <AddExpenseForm
                  groupId={groupId}
                  members={members || []}
                  onSuccess={() => {
                    refreshData();
                    setShowAddExpense(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* Expenses List */}
          {!expenseIds || expenseIds.length === 0 ? (
            <div className="text-center py-12 bg-base-200 rounded-xl">
              <span className="text-5xl">📝</span>
              <p className="mt-4 text-lg font-semibold">No Expenses Yet</p>
              <p className="opacity-70">Add your first expense to start tracking</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {[...expenseIds].reverse().map(expenseId => (
                <ExpenseCardWrapper key={expenseId.toString()} expenseId={expenseId} currentUserAddress={address} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "balances" && (
        <div className="space-y-6">
          {/* Debts I owe */}
          {myDebts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>💸</span> You Owe
              </h3>
              <div className="grid gap-3">
                {myDebts.map((debt: SimplifiedDebt, idx: number) => (
                  <BalanceCard
                    key={idx}
                    groupId={groupId}
                    creditor={debt.creditor}
                    amount={debt.amount}
                    currentUserAddress={address}
                    onSettled={refreshData}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Money owed to me */}
          {owedToMe.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>💰</span> Owed to You
              </h3>
              <div className="grid gap-3">
                {owedToMe.map((debt: SimplifiedDebt, idx: number) => (
                  <BalanceCard
                    key={idx}
                    groupId={groupId}
                    creditor={debt.creditor}
                    amount={debt.amount}
                    currentUserAddress={address}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All settled */}
          {myDebts.length === 0 && owedToMe.length === 0 && (
            <div className="text-center py-12 bg-success/10 rounded-xl border border-success/20">
              <span className="text-5xl">✅</span>
              <p className="mt-4 text-lg font-semibold text-success">All Settled!</p>
              <p className="opacity-70">No pending debts in this group</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Expense Card Wrapper to fetch individual expense data
function ExpenseCardWrapper({ expenseId, currentUserAddress }: { expenseId: bigint; currentUserAddress?: string }) {
  const { data: expenseData } = useScaffoldReadContract({
    contractName: "SplitChain",
    functionName: "getExpense",
    args: [expenseId],
  });

  if (!expenseData) {
    return (
      <div className="card bg-base-200 animate-pulse">
        <div className="card-body p-4">
          <div className="h-4 bg-base-300 rounded w-1/2"></div>
          <div className="h-6 bg-base-300 rounded w-1/4 mt-2"></div>
        </div>
      </div>
    );
  }

  const [, payer, amount, description, timestamp, participants] = expenseData;

  return (
    <ExpenseCard
      expense={{
        payer,
        amount,
        description,
        timestamp,
        participants,
      }}
      currentUserAddress={currentUserAddress}
    />
  );
}

export default GroupDetailPage;
