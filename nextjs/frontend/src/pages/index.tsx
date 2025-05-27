// import Image from "next/image";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ContentLayout from "@/components/ui/ContentLayout";
import Footer from "@/components/Footer";
import { LayoutGridLayer } from "@/components/CardLayout";

export default function Home() {
  return (
   <div>
   
    <div>
    <Navbar />
    </div>
    <div className=" h-2 bg-amber-500">

    </div>
     <Hero />
    <ContentLayout />
    <LayoutGridLayer />
    <Footer />
   </div>
  );
}
