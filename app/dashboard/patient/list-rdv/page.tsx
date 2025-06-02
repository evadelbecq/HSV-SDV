"use client";

import AppointmentCard from './appointmentCard';
import React, { useState, useEffect } from 'react';
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

const Page: React.FC = () => {
  // State local pour gérer les rendez-vous
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  // Récupération de l'id du patient pour le user id connecté
  const fetchPatientId = async (): Promise<number | null> => {
    try {
      const user_id = auth.user?.user_id || 0;
      console.log("User ID:", user_id);
      
      const response = await api.getPatientById(user_id);
      const patientId = response.patient_id;
      return patientId;
    } catch (error) {
      console.error("Error fetching patient ID:", error);
      setError("Erreur lors de la récupération de l'ID patient");
      return null;
    }
  };

  // Récupération des rendez-vous du patient
  const fetchAppointments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const patientId = await fetchPatientId();
      if (!patientId) {
        setError("Impossible de récupérer l'ID patient");
        return;
      }
      
      console.log("Patient ID:", patientId);
      const appointmentsData = await api.getPatientAppointments(patientId);
      console.log("Appointments:", appointmentsData);
      
      // Mapper les données de l'API vers le format attendu par le composant
      const formattedAppointments: Appointment[] = appointmentsData.map((apt: any) => {
        // Formatage des dates et heures
        const startDate = new Date(apt.start_date);
        const endDate = new Date(apt.end_date);
    
        
        // Formatage de la date (ex: "25 mai 2025")
        const dateFormatted = startDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
        // Formatage des heures (ex: "16:30")
        const heureDebut = startDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const heureFin = endDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
        // recupération du nom du docteur 
        async function getDoctorName(doctorId: number) {
          try {
            const doctorData = await api.getDoctorById(doctorId);
            console.log("Doctor Data:", doctorData);
            return doctorData.user.last_name + " " + doctorData.user.first_name || "Inconnu";
          } catch (error) {
            console.error("Error fetching doctor name:", error);
            return "Docteur Inconnu";
          }
        }
        return {
          id: apt.appointment_id,
          specialite: apt.specialite || apt.specialty || "Consultation générale",
          docteur: apt.doctor_name || getDoctorName(apt.doctor_id) || " Inconnu",
          heureDebut: heureDebut,
          heureFin: heureFin,
          date: dateFormatted,
          adresse: apt.address || apt.adresse || "30 rue du normand"
        };
      });
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Erreur lors de la récupération des rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  // Charger les rendez-vous au montage du composant
  useEffect(() => {
    if (auth.user) {
      fetchAppointments();
    }
  }, [auth.user]);

  // Fonction de suppression
  const handleDelete = async (id: number) => {
    try {
      // Optionnel : Appeler l'API pour supprimer le rendez-vous côté serveur
      // await api.deleteAppointment(id);
      
      // Mettre à jour l'état local
      setAppointments((prev) => prev.filter(app => app.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Erreur lors de la suppression du rendez-vous");
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h2 className="text-3xl md:text-4xl font-medium text-green-800 mb-6 md:mb-8">Vos Rendez-vous</h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center mb-6">
          <p className="text-gray-600 text-lg">Chargement de vos rendez-vous...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="p-4 md:p-8">
        <h2 className="text-3xl md:text-4xl font-medium text-green-800 mb-6 md:mb-8">Vos Rendez-vous</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center mb-6">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchAppointments}
            className="mt-4 bg-red-100 text-red-800 rounded-md px-4 py-2 hover:bg-red-200 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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