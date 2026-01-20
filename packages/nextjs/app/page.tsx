"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-4 py-16">
        <div className="text-center max-w-3xl">
          {/* Logo/Icon */}
          <div className="text-7xl mb-6">⛓️💸</div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            SplitChain
          </h1>

          {/* Tagline */}
          <p className="text-xl opacity-80 mb-8">
            Split expenses. Settle instantly. <span className="text-primary font-semibold">On the blockchain.</span>
          </p>

          {/* Description */}
          <p className="text-lg opacity-60 max-w-xl mx-auto mb-8">
            The decentralized Splitwise alternative with one-click crypto settlement, immutable records, and debt
            optimization. No more chasing payments.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {isConnected ? (
              <Link href="/groups" className="btn btn-primary btn-lg gap-2">
                <span>👥</span>
                Go to Groups
              </Link>
            ) : (
              <RainbowKitCustomConnectButton />
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-base-200 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why SplitChain?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <span className="text-5xl mb-4">⚡</span>
                <h3 className="card-title">One-Click Settlement</h3>
                <p className="opacity-70">
                  No more waiting for people to pay back. Settle debts instantly with a single transaction.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <span className="text-5xl mb-4">🔒</span>
                <h3 className="card-title">Immutable Records</h3>
                <p className="opacity-70">
                  &ldquo;I already paid you back&rdquo; — Blockchain doesn&apos;t lie. Timestamped proof for every
                  transaction.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <span className="text-5xl mb-4">🧮</span>
                <h3 className="card-title">Smart Debt Optimization</h3>
                <p className="opacity-70">
                  Our algorithm minimizes transactions. Instead of 6 payments, maybe just 2 are needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold">Create a Group</h3>
                <p className="opacity-70">
                  Add your friends, roommates, or travel buddies using their wallet addresses.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-content font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold">Add Expenses</h3>
                <p className="opacity-70">Record who paid for what and split equally among participants.</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-content font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold">Settle Instantly</h3>
                <p className="opacity-70">
                  See optimized debts and pay with one click. Funds transfer directly to the creditor.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            {isConnected ? (
              <Link href="/groups" className="btn btn-primary btn-lg">
                Start Splitting →
              </Link>
            ) : (
              <div>
                <p className="mb-4 opacity-70">Connect your wallet to get started</p>
                <RainbowKitCustomConnectButton />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
