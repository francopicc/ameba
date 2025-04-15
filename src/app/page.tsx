import Hero from "@/components/ui/Hero";
import Navbar from "@/components/ui/Navbar";

export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Navbar />
      <Hero />
    </main>
  );
}