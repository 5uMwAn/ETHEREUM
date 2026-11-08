"use client";

import { type FormEvent, useEffect, useState } from "react";
import { MyHoldings } from "./_components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/tokenization/ipfs-fetch";

type ImageStatus = "idle" | "loading" | "valid" | "invalid";

const MyNFTs: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourCollectible",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageStatus, setImageStatus] = useState<ImageStatus>("idle");
  const [isMinting, setIsMinting] = useState(false);

  // Check whether the supplied URL actually loads an image.
  useEffect(() => {
    const url = imageUrl.trim();

    if (!url) {
      setImageStatus("idle");
      return;
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);

      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        setImageStatus("invalid");
        return;
      }
    } catch {
      setImageStatus("invalid");
      return;
    }

    let cancelled = false;
    const previewImage = new window.Image();

    setImageStatus("loading");

    previewImage.onload = () => {
      if (!cancelled) {
        setImageStatus(previewImage.naturalWidth > 0 ? "valid" : "invalid");
      }
    };

    previewImage.onerror = () => {
      if (!cancelled) {
        setImageStatus("invalid");
      }
    };

    previewImage.src = parsedUrl.href;

    return () => {
      cancelled = true;
      previewImage.onload = null;
      previewImage.onerror = null;
    };
  }, [imageUrl]);

  const handleMintItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!connectedAddress) {
      notification.error("Please connect your wallet first.");
      return;
    }

    if (imageStatus !== "valid") {
      notification.error("Please enter a working image URL.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedName || !trimmedDescription || !trimmedImageUrl) {
      notification.error("Please complete all fields.");
      return;
    }

    const metadata = {
      name: trimmedName,
      description: trimmedDescription,
      image: trimmedImageUrl,
    };

    setIsMinting(true);
    const notificationId = notification.loading("Uploading NFT metadata to IPFS...");

    try {
      const uploadedItem = await addToIPFS(metadata);

      if (!uploadedItem.path) {
        throw new Error("IPFS did not return a metadata CID.");
      }

      notification.remove(notificationId);
      notification.success("Metadata uploaded. Waiting for mint transaction...");

      await writeContractAsync({
        functionName: "mintItem",
        args: [connectedAddress, uploadedItem.path],
      });

      notification.success("NFT minted successfully!");

      setName("");
      setDescription("");
      setImageUrl("");
      setImageStatus("idle");
    } catch (error) {
      notification.remove(notificationId);

      const message = error instanceof Error ? error.message : "Unknown error";
      notification.error(`Minting failed: ${message}`);
      console.error("NFT minting error:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      <h1 className="mb-2 text-3xl font-bold">My NFTs</h1>

      <p className="mb-8 text-base-content/70">Create NFTs using image URLs and store their metadata on IPFS.</p>

      {!isConnected || isConnecting ? (
        <div className="mb-10">
          <p className="mb-3">Connect your wallet to create an NFT.</p>
          <RainbowKitCustomConnectButton />
        </div>
      ) : (
        <form onSubmit={handleMintItem} className="mb-12 max-w-xl space-y-4">
          <div>
            <label className="mb-1 block font-medium" htmlFor="nft-name">
              NFT Name
            </label>

            <input
              id="nft-name"
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter NFT name"
              value={name}
              onChange={event => setName(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium" htmlFor="nft-description">
              Description
            </label>

            <textarea
              id="nft-description"
              className="textarea textarea-bordered w-full"
              placeholder="Describe your NFT"
              value={description}
              onChange={event => setDescription(event.target.value)}
              maxLength={1000}
              rows={4}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium" htmlFor="nft-image">
              Image URL
            </label>

            <input
              id="nft-image"
              type="url"
              className="input input-bordered w-full"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={event => {
                setImageUrl(event.target.value);
                setImageStatus("idle");
              }}
              required
            />

            <p className="mt-1 text-sm text-base-content/60">Use a publicly accessible image URL.</p>
          </div>

          {imageStatus === "loading" && <p className="text-sm text-base-content/70">Checking image...</p>}

          {imageStatus === "invalid" && (
            <p className="text-sm text-error">Unable to load this image. Check the URL and try another one.</p>
          )}

          {imageStatus === "valid" && (
            <div className="space-y-2">
              <p className="text-sm text-success">Image loaded successfully.</p>

              <img
                src={imageUrl.trim()}
                alt="NFT preview"
                className="max-h-64 max-w-full border border-base-300 object-contain"
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isMinting || imageStatus !== "valid"}>
            {isMinting ? "Minting..." : "Create NFT"}
          </button>
        </form>
      )}

      <div className="border-t border-base-300 pt-8">
        <h2 className="mb-5 text-2xl font-semibold">Your Collection</h2>
        <MyHoldings />
      </div>
    </div>
  );
};

export default MyNFTs;
