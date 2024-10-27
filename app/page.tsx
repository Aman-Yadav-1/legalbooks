import Hero from "@/UI/Hero";
import Forms from "@/UI/Forms";
import ForLawyers from "@/UI/ForLawyers";
import Template from "@/UI/Template";
import LawyersMainPage from "@/UI/LawyersMainPage";
export default function Home() {
  return (
    <div>
      <Hero />
      <Forms />
      <Template />
      <LawyersMainPage />
      <ForLawyers />
    </div>
  );
}
