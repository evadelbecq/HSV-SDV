import React from 'react';

interface AppointmentCardProps {
  specialite: string;
  docteur: string;
  heureDebut: string;
  heureFin: string;
  date: string;
  adresse: string;
  onDelete: () => void;
}

// Composant réutilisable pour un rendez-vous
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  specialite,
  docteur,
  heureDebut,
  heureFin,
  date,
  adresse,
  onDelete
}) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <h3 className="text-2xl font-medium">{specialite}</h3>
          <p className="text-gray-700 mt-1">Docteur {docteur}</p>
          <p className="text-lg font-medium mt-2">{heureDebut} - {heureFin}</p>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">{date}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">{adresse}</span>
            </div>
          </div>
        </div>
        
        <button
          className="text-gray-500 hover:text-red-500 transition-colors p-2 ml-4 flex-shrink-0"
          onClick={() => onDelete()}
          aria-label="Supprimer le rendez-vous"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;