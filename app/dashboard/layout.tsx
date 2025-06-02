'use client'

import React from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import api from '@/lib/client/api';
import { useAuth } from '@/lib/client/hooks/useAuth'
/* Import Logo */
import Logo from "@/public/assets/svg/HSV-removebg-preview - Copie.svg"

export default function Layout({ children }: { children: React.ReactNode }) {

    const [currentDatetime, setCurrentDateTime] = useState<string>("");
    const [patientName, setPatientName] = useState<string>("Chargement..."); // State pour le nom du patient
    const auth = useAuth();

    // Fonction pour récupérer le nom du patient
    async function fetchPatientname() {
        try {
            const user_id = auth.user?.user_id || 0;
            console.log("User ID:", user_id);

            const response = await api.getPatientById(user_id);
            console.log("Response:", response);

            // Récupérer le nom depuis la Promise result
            const firstName = response.user?.first_name || '';
            const lastName = response.user?.last_name || '';

            // Retourner le nom complet
            return `${firstName} ${lastName}`.trim() || "Utilisateur";

        } catch (error) {
            console.error("Erreur lors de la récupération du nom du patient:", error);
            return "John Doe"; // Valeur par défaut en cas d'erreur
        }
    }

    useEffect(() => {
        /* Récupérer la date afin de la reformater en format français */
        const dateFrenchFormat = () => {
            const now_date = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };

            // Format attendu : "Vendredi 27 juin 2025 14:18"
            const dateString = now_date.toLocaleDateString('fr-FR', options);
            const timeString = now_date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Première lettre en majuscule
            const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);
            setCurrentDateTime(`${formattedDate} ${timeString}`);
        };

        // Mettre à jour l'heure dès le chargement de la page
        dateFrenchFormat();

        // Mettre à jour l'heure toutes les secondes
        const intervalId = setInterval(dateFrenchFormat, 1000);

        // Nettoyer l'intervalle lors du démontage du composant
        return () => clearInterval(intervalId);
    }, []);

    // useEffect pour récupérer le nom du patient
    useEffect(() => {
        const loadPatientName = async () => {
            if (auth.user?.user_id) {
                const name = await fetchPatientname();
                setPatientName(name);
            }
        };

        loadPatientName();
    }, [auth.user?.user_id]); // Se déclenche quand l'user_id change

    return (
        <div>
            {/* Header Navigation */}
            <header className="flex justify-between items-center px-2 h-30 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <Image className="w-[100px] h-auto text-green-500" src={Logo} alt="Logo image" width={100} height={50} />
                </div>

                <div className="flex-1 text-center">
                    <h1 className="text-gray-500">Bienvenue, {patientName}</h1>
                </div>

                <div className="text-green-700">
                    <p className="text-sm">{currentDatetime}</p>
                </div>
            </header>

            <div className="flex">
                <aside className="w-30 border-r border-gray-200 h-screen flex flex-col items-center py-6 gap-8">
                    {/* User Profile Icon */}
                    <a href="#" className="text-green-600 hover:text-green-800">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </a>

                    {/* Add Icon */}
                    <a href="#" className="text-green-600 hover:text-green-800">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </a>

                    {/* Calendar Icon */}
                    <a href="#" className="text-green-600 hover:text-green-800 relative">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">1</span>
                    </a>

                    {/* Settings Icon */}
                    <a href="#" className="text-gray-400 hover:text-gray-600">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </a>

                    {/* Logout Icon */}
                    <a href="#" className="text-green-600 hover:text-green-800 mt-auto">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-3.293-3.293a1 1 0 00-1.414 1.414L11.586 7H7a1 1 0 100 2h4.586l-2.293 2.293a1 1 0 101.414 1.414L14 9.414V13a1 1 0 102 0V7.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </a>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}