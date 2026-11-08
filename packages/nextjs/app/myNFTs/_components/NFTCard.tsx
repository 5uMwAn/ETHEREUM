"use client";

import { useState } from "react";
import type { Collectible } from "./MyHoldings";
import { Address, AddressInput } from "@scaffold-ui/components";
import { isAddress } from "viem";
import { useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const NFTCard = ({ nft }: { nft: Collectible }) => {
  const { targetNetwork } = useTargetNetwork();

  const [transferToAddress, setTransferToAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourCollectible",
  });

  const isValidAddress = isAddress(transferToAddress);
  const isSameAddress = isValidAddress && transferToAddress.toLowerCase() === nft.owner.toLowerCase();

  const handleTransfer = async () => {
    if (!isValidAddress) {
      notification.error("Please enter a valid Ethereum address.");
      return;
    }

    if (isSameAddress) {
      notification.error("This NFT already belongs to that address.");
      return;
    }

    setIsTransferring(true);
    const notificationId = notification.loading("Waiting for transfer transaction...");

    try {
      await writeContractAsync({
        functionName: "transferFrom",
        args: [nft.owner as `0x${string}`, transferToAddress as `0x${string}`, BigInt(nft.id)],
      });

      notification.remove(notificationId);
      notification.success(`NFT #${nft.id} transferred successfully!`);
      setTransferToAddress("");
    } catch (error) {
      notification.remove(notificationId);

      const message = error instanceof Error ? error.message : "Unknown error";
      notification.error(`Transfer failed: ${message}`);
      console.error("NFT transfer error:", error);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
      <figure className="relative">
        <img src={nft.image} alt={nft.name || `NFT #${nft.id}`} className="h-60 min-w-full object-cover" />

        <figcaption className="glass absolute bottom-4 left-4 p-4">
          <span className="text-white"># {nft.id}</span>
        </figcaption>
      </figure>

      <div className="card-body space-y-3">
        <div className="flex items-center justify-center">
          <p className="text-xl p-0 m-0 font-semibold">{nft.name}</p>

          <div className="flex flex-wrap space-x-2 mt-1">
            {nft.attributes?.map((attr, index) => (
              <span key={index} className="badge badge-primary px-1.5">
                {attr.value}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center mt-1">
          <p className="my-0 text-lg">{nft.description}</p>
        </div>

        <div className="flex space-x-3 mt-1 items-center">
          <span className="text-lg font-semibold">Owner:</span>
          <Address address={nft.owner} chain={targetNetwork} />
        </div>

        <div className="flex flex-col my-2 space-y-1">
          <span className="text-lg font-semibold mb-1">Transfer To:</span>

          <AddressInput
            value={transferToAddress}
            placeholder="Receiver address"
            onChange={newValue => setTransferToAddress(newValue)}
          />

          {transferToAddress.length > 0 && !isValidAddress && (
            <p className="text-sm text-error">Invalid Ethereum address.</p>
          )}

          {isSameAddress && <p className="text-sm text-error">This is already the owner&apos;s address.</p>}
        </div>

        <div className="card-actions justify-end">
          <button
            className="btn btn-secondary btn-md px-8 tracking-wide"
            onClick={handleTransfer}
            disabled={!isValidAddress || isSameAddress || isTransferring}
          >
            {isTransferring ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
