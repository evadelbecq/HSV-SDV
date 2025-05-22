"use client";
/* Import Image */
import Image from "next/image";
import HeroImage from "@/public/assets/trombi/hero_image_4k-Photoroom.png";
/* Import Assets */
// import Logo from "@/public/assets/svg/HSV-removebg-preview.svg";
import Logo from "@/public/assets/svg/HSV-removebg-preview.svg";

/* import UI Components */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  /*CardHeader*/
  CardTitle,
} from "@/components/ui/card";

import CalendarIcon from "@/public/assets/icons/calendar-svgrepo-com.svg";
import FacebookIcon from "@/public/assets/icons/facebook-svgrepo-com.svg";
import LinkedinIcon from "@/public/assets/icons/linkedin-svgrepo-com.svg";
import GoogleIcon from "@/public/assets/icons/google-plus-svgrepo-com.svg";
import SendMailIcon from "@/public/assets/icons/send-svgrepo-com.svg";

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
      <section className="flex flex-col items-center justify-center mt-15 px-4">
        <div className="mt-15 text-[##002f22] text-center mb-10">
          <h2 className="text-4xl font-medium mt-15">
            <span className="text-[#05C481]">N</span>os Services
          </h2>
          <h5 className="text-2xl mt-10">
            Facilitez vos démarches médicales grâce à une plateforme rapide,
            sécurisée et pensée pour tous
          </h5>
        </div>

        {/* Single Services Grid - 2x2 layout */}
        <div className="grid grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Card 1 */}
          <Card className="flex flex-col items-center p-6">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[#05C481]/10 mb-4">
              <Image
                src={CalendarIcon}
                alt="Calendar Icon"
                width={50}
                height={50}
                priority
              />
            </div>
            <CardTitle className="text-center mb-4">
              Prise de rendez-vous en ligne 24h/7j
            </CardTitle>
            <CardContent className="text-center">
              <p>
                Réservez un créneau médical à tout moment, en quelques clics,
                sans avoir besoin d&apos;appeler.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="flex flex-col items-center p-6">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[#05C481]/10 mb-4">
              <Image
                src={CalendarIcon}
                alt="Calendar Icon"
                width={50}
                height={50}
                priority
              />
            </div>
            <CardTitle className="text-center mb-4">
              Téléconsultation sécurisée
            </CardTitle>
            <CardContent className="text-center">
              <p>
                Consultez à distance avec nos praticiens via notre plateforme
                sécurisée et accessible.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05C481]/25 text-[#002f22] mt-20 pt-5">
        <div className="container mx-auto py-10">
          {/* Top Footer Section */}
          <div className="grid md:grid-cols-3 gap-8 border-b border-[#05C481]/20 pb-8">
            {/* Logo and Tagline */}
            <div className="flex items-center text-center">
              <div className="w-[120px]">
                <Image
                  src={Logo}
                  alt="HSV Logo"
                  width={120}
                  height={60}
                  priority
                />
              </div>
              <p className="text-sm font-medium mt-4 max-w-[250px]">
                <span className="text-[#008057] font-semibold">V</span>otre
                plateforme de prise de rendez-vous et de suivi médical accessible
                24h/7j
              </p>
            </div>

            {/* Contact Form */}
            <div className="text-center items-center">
              <h3 className="font-medium text-lg mb-3">
                <span className="text-[#008057]">U</span>ne question ou demande
                de renseignement ?
              </h3>
              <div className="flex items-center justify-center">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="mr-5 max-w-[250px] border-[#05C481] focus:border-[#008057] focus:ring-[#008057]"
                />
                <Button className="bg-[#05C481] text-black rounded-full hover:bg-[#008057]">
                  <Image src={SendMailIcon} alt="Icone Envoie mail" width={22} height={22} />
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center">
              <h3 className="font-medium text-lg mb-3">
                <span className="text-[#008057]">S</span>uivez notre actualité
              </h3>
              <div className="flex justify-center gap-6 mt-2">
                <a href="#" className="transition-transform hover:scale-110">
                  <Image src={GoogleIcon} alt="Google" width={28} height={28} />
                </a>
                <a href="#" className="transition-transform hover:scale-110">
                  <Image src={FacebookIcon} alt="Facebook" width={28} height={28} />
                </a>
                <a href="#" className="transition-transform hover:scale-110">
                  <Image src={LinkedinIcon} alt="LinkedIn" width={28} height={28} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="py-8 border-b border-[#05C481]/20">
            <h3 className="text-xl font-semibold mb-6 text-center">
              <span className="text-[#008057]">C</span>ontact
            </h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto font-medium text-semibold">
              <div className="flex items-center gap-3">
                <div className="bg-[#05C481]/10 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#008057]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p>11 Rue de Lyon - Paris 17</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#05C481]/10 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#008057]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p>hsv@gmail.com</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#05C481]/10 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#008057]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <p>+33 1 53 20 02 00</p>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="pt-10 pb-10 font-medium text-semibold">
            {/* Links row */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-row space-x-8 text-sm">
                <a href="#" className="hover:text-[#008057] transition-colors">Mentions légales</a>
                <a href="#" className="hover:text-[#008057] transition-colors">Politique de confidentialité</a>
                <a href="#" className="hover:text-[#008057] transition-colors">CGU</a>
              </div>
            </div>

            {/* Copyright text */}
            <div className="text-center">
              <p className="text-sm">
                <span className="text-[#008057] font-semibold">©</span> {new Date().getFullYear()} HSV - Tous Droits Réservés
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
