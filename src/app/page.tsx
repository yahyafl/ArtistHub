import HeroSection from "@/components/home/HeroSection";
import LatestSongs from "@/components/home/LatestSongs";
import PlaylistGenerator from "@/components/home/PlaylistGenerator";
import { fetchTopByGenre } from "@/lib/itunes";

export default async function Home() {
  const initialTracks = await fetchTopByGenre("indie", 10);

  return (
    <main>
      <HeroSection />
      <LatestSongs initialTracks={initialTracks} />
      <PlaylistGenerator />
    </main>
  );
}