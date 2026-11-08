import { PublicGallery } from "./_components/PublicGallery";
import type { NextPage } from "next";

const GalleryPage: NextPage = () => {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10">
      <PublicGallery />
    </main>
  );
};

export default GalleryPage;
