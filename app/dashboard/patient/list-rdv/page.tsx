
"use client";

import AppointmentCard from './appointmentCard';
import React, { useState } from 'react';
import api from '@/lib/client/api';
import { useAuth } from '@/lib/client/hooks/useAuth'
interface Appointment {
  id: number;
  specialite: string;
  docteur: string;
  heureDebut: string;
  heureFin: string;
  date: string;
  adresse: string;
}



const initialAppointments: Appointment[] = [
  {
    id: 1,
    specialite: "Cardiologue",
    docteur: "Thierry Doberman",
    heureDebut: "11H",
    heureFin: "12h",
    date: "19 mai 2025",
    adresse: "38 rue du normand"
  },
  {
    id: 2,
    specialite: "Orthopédiste",
    docteur: "Armand Caniche",
    heureDebut: "14H",
    heureFin: "16h",
    date: "21 mai 2025",
    adresse: "38 rue du normand"
  }
];

// Composant sans état (stateless)
const Page: React.FC = () => {
  // State local pour gérer les rendez-vous
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const auth = useAuth();


  // recuperation de l'id du user

  // recuperer l'id du patient pour le user id connecté
  async function fetchPatientId() {
    try {
      const user_id = auth.user?.user_id || 0;
      console.log("User ID lol:", user_id);

      const response = await api.getPatientById(user_id);
      const patientId = response.patient_id;
      console.log("Patient ID:", patientId);
      return patientId;
    }
    catch (error) {
      console.error("Error fetching patient ID:", error);
    }
  }
  // Appel de la fonction pour récupérer l'ID du patient

  // Récupération des rendez-vous du patient
async function fetchAppointments() {
  
  const patientid = await fetchPatientId();
  console.log("Patient ID2:", patientid);
  const appointments = await api.getPatientAppointments(patientid);
  console.log("Appointments:", appointments);
}
fetchAppointments();



  // Fonction de suppression
  const handleDelete = (id: number) => {
    setAppointments((prev) => prev.filter(app => app.id !== id));
  };


  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-medium text-green-800 mb-6 md:mb-8">Vos Rendez-vous</h2>

      {appointments.length > 0 ? (
        <div className="space-y-4 md:space-y-6 max-w-4xl">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              specialite={appointment.specialite}
              docteur={appointment.docteur}
              heureDebut={appointment.heureDebut}
              heureFin={appointment.heureFin}
              date={appointment.date}
              adresse={appointment.adresse}
              onDelete={() => handleDelete(appointment.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center mb-6">
          <p className="text-gray-600 text-lg">Vous n'avez pas de rendez-vous planifiés</p>
        </div>
      )}

      <div className="mt-8">
        <button className="bg-green-100 text-green-800 rounded-md px-4 py-3 md:px-6 hover:bg-green-200 transition-colors flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Planifier un nouveau rendez-vous
        </button>
      </div>
    </div>
  );
};

export default Page;