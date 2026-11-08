"use client";

import { useEffect, useState } from "react";
import { Address } from "@scaffold-ui/components";
import { useScaffoldContract, useScaffoldReadContract, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { getMetadataFromIPFS } from "~~/utils/tokenization/ipfs-fetch";
import type { NFTMetaData } from "~~/utils/tokenization/nftsMetadata";

interface GalleryNFT extends Partial<NFTMetaData> {
  id: number;
  uri: string;
  owner: string;
}

export const PublicGallery = () => {
  const { targetNetwork } = useTargetNetwork();

  const [nfts, setNfts] = useState<GalleryNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadError, setLoadError] = useState("");

  const { data: contract } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "totalSupply",
    watch: true,
  });

  useEffect(() => {
    if (!contract || totalSupply === undefined) return;

    let cancelled = false;

    const loadGallery = async () => {
      setLoading(true);
      setLoadError("");

      const collection: GalleryNFT[] = [];

      try {
        const count = Number(totalSupply);

        for (let index = 0; index < count; index++) {
          try {
            const tokenId = await contract.read.tokenByIndex([BigInt(index)]);

            const [owner, uri] = await Promise.all([
              contract.read.ownerOf([tokenId]),
              contract.read.tokenURI([tokenId]),
            ]);

            let metadata: Partial<NFTMetaData> = {};

            try {
              const ipfsHash = uri.replace(/^https?:\/\/[^/]+\/ipfs\//i, "").replace(/^ipfs:\/\//i, "");

              metadata = await getMetadataFromIPFS(ipfsHash);
            } catch (error) {
              console.error(`Could not load metadata for NFT #${tokenId}:`, error);
            }

            collection.push({
              id: Number(tokenId),
              uri,
              owner,
              ...metadata,
            });
          } catch (error) {
            console.error(`Could not load NFT at collection index ${index}:`, error);
          }
        }

        collection.sort((a, b) => a.id - b.id);

        if (!cancelled) {
          setNfts(collection);
        }
      } catch (error) {
        console.error("Gallery loading failed:", error);

        if (!cancelled) {
          setLoadError("Unable to load the NFT collection. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, [contract?.address, totalSupply, refreshKey]);

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Public Gallery</h1>
          <p className="mt-2 text-base-content/70">Browse every NFT minted through this collection.</p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={() => setRefreshKey(value => value + 1)} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : loadError ? (
        <p className="py-8 text-center text-error">{loadError}</p>
      ) : nfts.length === 0 ? (
        <p className="py-12 text-center text-base-content/70">No NFTs have been minted yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nfts.map(nft => (
            <article key={nft.id} className="overflow-hidden border border-base-300">
              <div className="flex h-64 items-center justify-center bg-base-200">
                {nft.image ? (
                  <img src={nft.image} alt={nft.name || `NFT #${nft.id}`} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-sm text-base-content/60">Image unavailable</span>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="text-sm text-base-content/60">Token #{nft.id}</p>
                  <h2 className="text-xl font-semibold">{nft.name || "Untitled NFT"}</h2>
                </div>

                <p className="text-sm text-base-content/80">{nft.description || "No description available."}</p>

                <div className="border-t border-base-300 pt-3">
                  <p className="mb-1 text-sm font-semibold">Current owner</p>
                  <Address address={nft.owner as `0x${string}`} chain={targetNetwork} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
