'use client';
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
      url: "#"
    },
    {
      name: "Nos Services",
      url: "#"
    },
    {
      name: "Contactez-nous",
    }

  ];
  return (
    <>
    <nav className="bg-white border-2 h-[85px] p-4">
      <div className="flex justify-between items-center">
        <div>{/* Container for svg */}</div>
    <ul>
      {links.map((link, index) => (
        <li key={index} className="inline-block p-4 mr-8">
          <a href={link.url ? link.url : ""}>{link.name}</a>
        </li>
      ))}
    </ul>

    <div className="pr-2">
      <Button className="bg-[#05C481] text-black hover:bg-[#008057]">
        Inscrivez-vous
        </Button>
      <Button className="bg-white text-black hover:bg-[#05C481] border-2 border-[#05C481] ml-4">       Connexion
        </Button>
    </div>
      </div>
      
    </nav>
    </>
  );
}
