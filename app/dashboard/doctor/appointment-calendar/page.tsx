'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

/* A utiliser lorsqu'il y aura de la data dans la table appointments */
// import api from '@/lib/client/api';

export default function Page() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Define appointment types 
  interface Appointment {
    id: number;
    title: string;
    start: string; // ISO date string
    end: string; // ISO date string
    patientName: string;
    status?: string;
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const dummyAppointments: Appointment[] = [
          {
            id: 1,
            title: 'Sophie Martin - Consultation',
            start: '2025-05-23T09:00:00',
            end: '2025-05-23T11:30:00',
            patientName: 'Sophie Martin',
            status: 'scheduled'
          },
          {
            id: 2,
            title: 'Lucas Dubois - Suivi',
            start: '2025-05-23T12:30:00',
            end: '2025-05-23T13:45:00',
            patientName: 'Lucas Dubois',
            status: 'scheduled'
          },
          {
            id: 3,
            title: 'Emma Bernard - Consultation',
            start: '2025-05-24T14:00:00',
            end: '2025-05-24T14:30:00',
            patientName: 'Emma Bernard',
            status: 'scheduled'
          }
        ];
        setAppointments(dummyAppointments);
      }
      catch {
        console.error('Error during fetching process')
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <div className="p-4 w-full text-[#008057]">
        {/* Main Content Area */}
        <h1 className="text-2xl font-semibold mb-6"><span className=''>C</span>alendrier des Rendez-vous</h1>
        <div className="calendar-container bg-white p-4 rounded-lg shadow">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={appointments.map(a => ({ ...a, id: String(a.id) }))}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            weekends={false}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
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
            eventColor="#008057"
            height="auto"
            allDaySlot={false}
            slotDuration="00:30:00" // 30-minute slots
            slotLabelInterval="01:00:00" // 1-hour labels
          />
        </div>
      </div>
    </>
  );
}