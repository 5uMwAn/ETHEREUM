import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="text-sm tracking-widest text-base-content/60">ETHEREUM / TOKENIZATION</p>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight">A simple NFT tokenization platform.</h1>

      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-base-content/70">
        An application demonstrating how digital assets can be created, represented and transferred on the Ethereum
        blockchain.
      </p>

      <div className="mt-8 flex flex-wrap gap-6">
        <Link href="/gallery" className="link">
          Explore Gallery →
        </Link>
        <Link href="/myNFTs" className="link">
          Create an NFT →
        </Link>
      </div>

      <hr className="my-12 border-base-300" />

      <section>
        <h2 className="text-2xl font-semibold">About the project</h2>
        <p className="mt-4 leading-relaxed text-base-content/70">
          This platform allows users to create NFTs using an image URL and descriptive metadata. Each NFT is represented
          by a unique token on Ethereum, with ownership recorded by a smart contract.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How it works</h2>

        <ol className="mt-5 list-decimal space-y-4 pl-6 leading-relaxed">
          <li>
            <strong>Create:</strong> Provide an image URL, name and description.
          </li>
          <li>
            <strong>Store:</strong> NFT metadata is uploaded to IPFS.
          </li>
          <li>
            <strong>Mint:</strong> A Solidity smart contract creates the NFT and records its ownership.
          </li>
          <li>
            <strong>Manage:</strong> Explore the collection, view your NFTs and transfer them to other wallets.
          </li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Technology</h2>
        <p className="mt-4 leading-relaxed text-base-content/70">
          Solidity · Hardhat · Ethereum · IPFS · Next.js · Wagmi · Viem · RainbowKit
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Network information</h2>
        <p className="mt-4 text-base-content/70">Network: Ethereum Sepolia Testnet</p>
        <p className="mt-2 break-all text-sm">Contract: 0x5ad74cf92f36e514b0b9c593a4f77acc02c0b7da</p>
        <a
          href="https://sepolia.etherscan.io/address/0x5ad74cf92f36e514b0b9c593a4f77acc02c0b7da"
          target="_blank"
          rel="noreferrer"
          className="link mt-3 inline-block"
        >
          View contract on Etherscan →
        </a>
      </section>

      <footer className="mt-16 border-t border-base-300 pt-6 text-sm text-base-content/60">
        An educational project demonstrating NFT tokenization on Ethereum.
      </footer>
    </main>
  );
};

export default Home;
