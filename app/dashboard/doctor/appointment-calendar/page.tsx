'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useAuth } from '@/lib/client/hooks/useAuth'
import api from '@/lib/client/api';

// Interface pour les rendez-vous
interface Appointment {
  id: number;
  title: string;
  start: string; // ISO date string
  end: string; // ISO date string
  patientName: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type?: 'consultation' | 'suivi' | 'urgence' | 'controle';
  backgroundColor?: string;
  borderColor?: string;
}

// Interface pour les données brutes de l'API
interface RawAppointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  status: string;
  notes?: string;
  type?: string;
}

export default function Page() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const auth = useAuth();
  const user_id = auth.user?.user_id || 0;
  
  console.log('User ID:', user_id);

  // Fonction pour valider et formater une date
  const createValidDate = (dateStr: string, timeStr: string): Date | null => {
    try {
      // Vérifier que les valeurs ne sont pas nulles ou vides
      if (!dateStr || !timeStr) {
        console.error('Date ou heure manquante:', { dateStr, timeStr });
        return null;
      }

      // Nettoyer les chaînes
      const cleanDate = dateStr.trim();
      const cleanTime = timeStr.trim();

      // Vérifier le format de base
      if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
        console.error('Format de date invalide:', cleanDate);
        return null;
      }

      if (!/^\d{2}:\d{2}:\d{2}$/.test(cleanTime)) {
        console.error('Format d\'heure invalide:', cleanTime);
        return null;
      }

      // Méthode 1: Essayer avec le format ISO standard
      let dateTime = new Date(`${cleanDate}T${cleanTime}`);
      
      if (!isNaN(dateTime.getTime())) {
        return dateTime;
      }

      // Méthode 2: Essayer en parsant manuellement
      const [year, month, day] = cleanDate.split('-').map(Number);
      const [hours, minutes, seconds] = cleanTime.split(':').map(Number);
      
      dateTime = new Date(year, month - 1, day, hours, minutes, seconds);
      
      if (!isNaN(dateTime.getTime())) {
        return dateTime;
      }

      console.error('Impossible de créer une date valide:', { cleanDate, cleanTime });
      return null;

    } catch (error) {
      console.error('Erreur lors de la création de la date:', error, { dateStr, timeStr });
      return null;
    }
  };

  // Fonction pour récupérer le nom du patient
  const getPatientName = async (patient_id: number): Promise<string> => {
    try {
      const patientResponse = await api.getPatientById(patient_id);
      return `${patientResponse.first_name} ${patientResponse.last_name}`;
    } catch (error) {
      console.error(`Erreur lors de la récupération du patient ${patient_id}:`, error);
      return `Patient #${patient_id}`;
    }
  };

  // Fonction pour déterminer la couleur selon le type et le statut
  const getEventColors = (type?: string, status?: string) => {
    if (status === 'cancelled') {
      return { backgroundColor: '#808080', borderColor: '#606060' };
    }
    
    switch (type) {
      case 'consultation':
        return { backgroundColor: '#008057', borderColor: '#006045' };
      case 'suivi':
        return { backgroundColor: '#FF8C00', borderColor: '#E67C00' };
      case 'controle':
        return { backgroundColor: '#0066CC', borderColor: '#0052A3' };
      case 'urgence':
        return { backgroundColor: '#DC143C', borderColor: '#B91C3C' };
      default:
        return { backgroundColor: '#008057', borderColor: '#006045' };
    }
  };

  // Fonction pour convertir les données brutes en appointments formatés
  const formatAppointments = async (rawAppointments: RawAppointment[]): Promise<Appointment[]> => {
    const formattedAppointments: Appointment[] = [];
    const processingErrors: string[] = [];
    
    for (const rawApp of rawAppointments) {
      try {
        console.log('Traitement de l\'appointment:', rawApp);

        // Valider les données essentielles
        if (!rawApp.appointment_id) {
          console.error('ID d\'appointment manquant:', rawApp);
          continue;
        }

        // Créer les dates de début et fin
        const startDateTime = createValidDate(rawApp.appointment_date, rawApp.appointment_time);
        
        if (!startDateTime) {
          processingErrors.push(`Rendez-vous ID ${rawApp.appointment_id}: date/heure invalide`);
          continue;
        }

        // Calculer la date de fin (duration en minutes)
        const duration = rawApp.duration || 30; // Durée par défaut de 30 minutes
        const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));

        // Récupérer le nom du patient
        const patientName = await getPatientName(rawApp.patient_id);
        
        // Déterminer les couleurs
        const colors = getEventColors(rawApp.type, rawApp.status);
        
        const appointment: Appointment = {
          id: rawApp.appointment_id,
          title: patientName,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          patientName: patientName,
          status: rawApp.status as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
          type: rawApp.type as 'consultation' | 'suivi' | 'urgence' | 'controle',
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor
        };
        
        console.log('Appointment formaté avec succès:', appointment);
        formattedAppointments.push(appointment);
        
      } catch (error) {
        console.error('Erreur lors du formatage de l\'appointment:', rawApp, error);
        processingErrors.push(`Rendez-vous ID ${rawApp.appointment_id}: erreur de formatage`);
      }
    }
    
    // Mettre à jour les erreurs si nécessaire
    if (processingErrors.length > 0) {
      setErrors(processingErrors);
    }
    
    console.log(`${formattedAppointments.length} appointments formatés avec succès sur ${rawAppointments.length} total`);
    return formattedAppointments;
  };

  // Fonction pour récupérer les appointments depuis l'API
  const fetchAppointmentsFromAPI = async () => {
    try {
      setLoading(true);
      setErrors([]); // Réinitialiser les erreurs
      
      const response = await api.getDoctorById(user_id);
      console.log('Doctor data:', response);
      
      const doctor_id = response.doctor_id;
      console.log('Doctor ID:', doctor_id);
      
      const appointmentsResponse = await api.getAppointmentsByDoctorId(doctor_id);
      console.log('Raw appointments:', appointmentsResponse);
      
      // Vérifier que nous avons des données
      if (!appointmentsResponse || !Array.isArray(appointmentsResponse)) {
        console.error('Réponse d\'appointments invalide:', appointmentsResponse);
        setErrors(['Aucune donnée de rendez-vous trouvée']);
        return;
      }
      
      // Formater les appointments avec les noms des patients
      const formattedAppointments = await formatAppointments(appointmentsResponse);
      console.log('Formatted appointments:', formattedAppointments);
      
      setAppointments(formattedAppointments);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setErrors(['Erreur lors de la récupération des rendez-vous']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_id > 0) {
      fetchAppointmentsFromAPI();
    }
  }, [user_id]);

  // Fonction pour personnaliser l'affichage des événements
  const renderEventContent = (eventInfo: any) => {
    const appointment = appointments.find(a => a.id === parseInt(eventInfo.event.id));
    
    return (
      <div className="p-1 text-xs">
        <div className="font-semibold truncate">
          {appointment?.patientName}
        </div>
        <div className="opacity-90 truncate">
          {appointment?.type && (
            <span className="capitalize">
              {appointment.type}
            </span>
          )}
        </div>
        {appointment?.status && (
          <div className="text-xs opacity-75 capitalize">
            {appointment.status === 'scheduled' && '📅'}
            {appointment.status === 'confirmed' && '✅'}
            {appointment.status === 'completed' && '✓'}
            {appointment.status === 'cancelled' && '❌'}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 w-full text-[#008057]">
        <h1 className="text-2xl font-semibold mb-6">
          <span className="">C</span>alendrier des Rendez-vous
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement des rendez-vous...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 w-full text-[#008057]">
        <h1 className="text-2xl font-semibold mb-6">
          <span className="">C</span>alendrier des Rendez-vous
        </h1>
        
        {/* Affichage des erreurs s'il y en a */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium mb-2">Erreurs de traitement :</h3>
            <ul className="list-disc list-inside text-red-700 text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Légende des couleurs */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-2 text-gray-700">Légende :</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#008057] rounded"></div>
              <span>Consultation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#FF8C00] rounded"></div>
              <span>Suivi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#0066CC] rounded"></div>
              <span>Contrôle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#DC143C] rounded"></div>
              <span>Urgence</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#808080] rounded"></div>
              <span>Annulé</span>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <div className="text-lg font-bold text-[#008057]">
              {appointments.filter(a => a.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Programmés</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <div className="text-lg font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmés</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <div className="text-lg font-bold text-purple-600">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Terminés</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <div className="text-lg font-bold text-gray-600">
              {appointments.filter(a => a.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Annulés</div>
          </div>
        </div>

        {/* Message si aucun rendez-vous */}
        {appointments.length === 0 && !loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">Aucun rendez-vous trouvé pour cette période.</p>
          </div>
        )}

        {/* Calendrier */}
        <div className="calendar-container bg-white p-4 rounded-lg shadow">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={appointments.map(a => ({
              id: String(a.id),
              title: a.title,
              start: a.start,
              end: a.end,
              backgroundColor: a.backgroundColor,
              borderColor: a.borderColor,
              extendedProps: {
                patientName: a.patientName,
                status: a.status,
                type: a.type
              }
            }))}
            eventContent={renderEventContent}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            weekends={false}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Lundi à Vendredi
              startTime: '08:00',
              endTime: '18:00'
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            locale="fr"
            buttonText={{
              today: "Aujourd'hui",
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour'
            }}
            height="auto"
            allDaySlot={false}
            slotDuration="00:15:00" // Créneaux de 15 minutes pour plus de précision
            slotLabelInterval="01:00:00" // Étiquettes toutes les heures
            eventMinHeight={50} // Hauteur minimum des événements
            eventClick={(info) => {
              // Fonction à implémenter plus tard pour l'édition
              console.log('Rendez-vous cliqué:', info.event.extendedProps);
            }}
          />
        </div>
      </div>
    </>
  );
}