"use client";
/* Import Image */
import Image from "next/image";
import HeroImage from "@/public/assets/trombi/hero_image_4k-Photoroom.png";
/* Import Assets */
import Logo from "@/public/assets/svg/HSV-removebg-preview.svg";

/* import UI Components */

import { Button } from "@/components/ui/button";

export default function Page() {
  interface Links {
    name: string;
    url?: string;
  }

  const links: Links[] = [
    {
      name: "Nos Practiciens",
      url: "#",
    },
    {
      name: "Nos Services",
      url: "#",
    },
    {
      name: "Contactez-nous",
    },
  ];
  return (
    <>
      <nav className=" flex flex-row justify-between bg-white border-2 h-auto p-4">
        {/* Logo HSV */}
        <div className="w-[100px]">
          <Image src={Logo} alt="HSV Logo" width={100} height={50} />
        </div>

        <div className="flex items-center space-x-72">
          <ul>
            {links.map((link, index) => (
              <li key={index} className="inline-block p-2 mr-8">
                <a href={link.url ? link.url : ""}>{link.name}</a>
              </li>
            ))}
          </ul>

          <div className="pr-2">
            <Button className="bg-[#05C481] text-black hover:bg-[#008057]">
              Inscrivez-vous
            </Button>
            <Button className="bg-white text-black hover:bg-[#05C481] border-2 border-[#05C481] ml-4">
              Connexion
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center">
        {/* Hero Intro Text */}
        <div className="flex-1 text-[##002f22] w-[50%]">
          <aside className="w-[75%] mx-auto">
            <h1 className="text-4xl font-medium mt-15">
              <span className="text-[#00A069]">P</span>renez et planifiez votre
              rendez-vous médical
            </h1>
            <h3 className="text-2xl mt-10">
              Besoin d’un médecin ? Trouvez votre professionnel de santé parmi
              nos practiciens et prenez rendez-vous en ligne en un click !
            </h3>
          </aside>

          {/* CTA Buttons */}
          <section className="flex flex-col justify-center mt-8 space-y-4 w-1/4 mx-auto">
            <Button className="bg-[#05C481] text-black hover:bg-[#008057]">
              Prendre rendez-vous
            </Button>
            <Button className="bg-white text-black hover:bg-[#05C481] border-2 border-[#05C481]">
              Découvrez notre équipe
            </Button>
          </section>
        </div>
        <div className="flex-1 relative">
          {/* Circle Background */}
          <div className="absolute rounded-full bg-gradient-to-r from-[#05C481]/50 to-[#01533b]/50 w-[650px] h-[650px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
          {/* Hero Image on the Circle Bg*/}
          <div className="relative z-10">
            <Image
              src={HeroImage}
              alt="photo médecin"
              width={600}
              height={600}
              unoptimized
              style={{
                width: "100%",
                height: "auto",
              }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Doctor Carrousel */}
      <section>
        <div>
          {/* Fetch data from the Doctor table, then map and extract only the wanted infos*/}
        </div>
        </section>
      
      {/* Section Services du site */}
      <section>
        <div>

        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>
          
        </div>
      </footer>
    </>
  );
}
