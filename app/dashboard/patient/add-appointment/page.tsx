'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/client/api';
import { useAuth } from '@/lib/client/hooks/useAuth'

interface AppointmentForm {
  dateRendezVous: string;
  heureRendezVous: string;
  specialite: string;
  nomPraticien: string;
  motifConsultation: string;
}

interface Doctor {
  doctor_id: number;
  user: {
    first_name: string;
    last_name: string;
  };
  specialization: {
    name: string;
  };
}

interface Reason {
  reason_id: number;
  label: string;
}

interface Specialization {
  specialization_id: number;
  name: string;
  reasons: Reason[];
}

const AppointmentBooking: React.FC = () => {
  const auth = useAuth();
  
  const [formData, setFormData] = useState<AppointmentForm>({
    dateRendezVous: '',
    heureRendezVous: '',
    specialite: '',
    nomPraticien: '',
    motifConsultation: ''
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const [dataError, setDataError] = useState('');

  // Charger les docteurs et spécialisations au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      setDataError('');

      try {
        console.log('Début du chargement des données...');

        // Charger les docteurs et spécialisations en parallèle
        const [doctorsResponse, specializationsResponse] = await Promise.all([
          api.getDoctors(),
          api.getSpecializations()
        ]);

        console.log('Réponse docteurs:', doctorsResponse);
        console.log('Réponse spécialisations:', specializationsResponse);

        if (doctorsResponse && Array.isArray(doctorsResponse)) {
          setDoctors(doctorsResponse);
          console.log('Docteurs chargés:', doctorsResponse.length);
        } else {
          console.warn('Aucune donnée de docteur reçue ou format invalide');
          setDoctors([]);
        }

        if (specializationsResponse && Array.isArray(specializationsResponse)) {
          setSpecializations(specializationsResponse);
          console.log('Spécialisations chargées:', specializationsResponse.length);
        } else {
          console.warn('Aucune donnée de spécialisation reçue ou format invalide');
          setSpecializations([]);
        }

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setDataError('Erreur lors du chargement des données. Veuillez rafraîchir la page.');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les docteurs par spécialité
  const getDoctorsBySpecialization = (specialization: string) => {
    if (!doctors || !Array.isArray(doctors)) {
      return [];
    }
    return doctors.filter(doctor =>
      doctor &&
      doctor.specialization &&
      doctor.specialization.name === specialization
    );
  };

  // Obtenir les raisons pour la spécialité sélectionnée
  const getReasonsForSpecialization = (specializationName: string) => {
    if (!specializations || !Array.isArray(specializations)) {
      return [];
    }
    const specialization = specializations.find(spec =>
      spec && spec.name === specializationName
    );
    return specialization && specialization.reasons ? specialization.reasons : [];
  };

  // Fonction pour obtenir le nom complet d'un doctor par son ID
  const getDoctorNameById = (doctorId: string): string => {
    const doctor = doctors.find(d => d.doctor_id.toString() === doctorId);
    if (doctor) {
      return `Dr. ${doctor.user.first_name} ${doctor.user.last_name}`;
    }
    return '';
  };

  // Fonction pour obtenir le reason_id par le label
  const getReasonIdByLabel = (label: string, specializationName: string): number | null => {
    const reasons = getReasonsForSpecialization(specializationName);
    const reason = reasons.find(r => r.label === label);
    return reason ? reason.reason_id : null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si on change de spécialité, on remet à zéro le praticien et le motif sélectionnés
    if (name === 'specialite') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        nomPraticien: '',
        motifConsultation: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const createAppointmentDateTime = (date: string, time: string): string => {
    return `${date}T${time}:00`;
  };

  const calculateEndDateTime = (startDateTime: string): string => {
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return end.toISOString().slice(0, 19);
  };

  // Fonction pour récupérer l'ID du patient
  const fetchPatientId = async (): Promise<number> => {
    try {
      const user_id = auth.user?.user_id || 0;
      console.log("User ID:", user_id);

      if (!user_id) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await api.getPatientById(user_id);
      const patientId = response.patient_id;
      console.log("Patient ID:", patientId);
      
      if (!patientId) {
        throw new Error('ID patient non trouvé');
      }

      return patientId;
    } catch (error) {
      console.error("Error fetching patient ID:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRobotVerified) {
      setSubmitMessage('Veuillez confirmer que vous n\'êtes pas un robot');
      return;
    }

    // Validation des champs requis
    if (!formData.dateRendezVous || !formData.heureRendezVous || 
        !formData.specialite || !formData.nomPraticien || !formData.motifConsultation) {
      setSubmitMessage('Veuillez remplir tous les champs requis');
      return;
    }

    setIsLoading(true);
    setSubmitMessage('');

    try {
      const startDateTime = createAppointmentDateTime(formData.dateRendezVous, formData.heureRendezVous);
      const endDateTime = calculateEndDateTime(startDateTime);

      // Validation et conversion du doctor_id
      const doctorId = parseInt(formData.nomPraticien);
      if (isNaN(doctorId)) {
        throw new Error('ID du praticien invalide');
      }

      // Récupération du reason_id basé sur le motif sélectionné
      const reasonId = getReasonIdByLabel(formData.motifConsultation, formData.specialite);
      if (!reasonId) {
        throw new Error('Motif de consultation invalide');
      }

      // Récupération de l'ID du patient
      const patientId = await fetchPatientId();

      const appointmentData = {
        patient_id: patientId,
        doctor_id: doctorId,
        reason_id: reasonId,
        start_date: startDateTime,
        end_date: endDateTime
      };

      console.log('Envoi des données:', appointmentData);

      const response = await api.createAppointment(appointmentData);

      // Vérification du succès de la création
      if (response && (response.status === 201 || response.appointment_id)) {
        setSubmitMessage('Rendez-vous créé avec succès !');
        
        // Réinitialisation du formulaire
        setFormData({
          dateRendezVous: '',
          heureRendezVous: '',
          specialite: '',
          nomPraticien: '',
          motifConsultation: ''
        });
        setIsRobotVerified(false);

        // Optionnel: redirection ou actions supplémentaires
        // setTimeout(() => {
        //   // Redirection vers la page des rendez-vous
        //   router.push('/appointments');
        // }, 2000);
        
      } else {
        throw new Error('Erreur lors de la création du rendez-vous');
      }

    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);

      let errorMessage = 'Une erreur inattendue s\'est produite';

      if (error.response) {
        // Erreur HTTP avec réponse du serveur
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     `Erreur serveur (${error.response.status})`;
      } else if (error.request) {
        // Erreur de réseau
        errorMessage = 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.';
      } else if (error.message) {
        // Erreur personnalisée
        errorMessage = error.message;
      }

      setSubmitMessage(`Erreur: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = formData.specialite ? getDoctorsBySpecialization(formData.specialite) : [];
  const availableReasons = formData.specialite ? getReasonsForSpecialization(formData.specialite) : [];

  // Affichage de chargement
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto mt-20 p-6 bg-red-100 border border-red-300 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-red-700">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Planifier un rendez-vous
      </h2>

      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg text-center transition-all duration-300 ${
          submitMessage.includes('succès')
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {submitMessage}
        </div>
      )}

      <div className="flex justify-center">
        <div className="w-full max-w-5xl rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date du rendez-vous *
                </label>
                <input
                  type="date"
                  name="dateRendezVous"
                  value={formData.dateRendezVous}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-green-500 outline-none transition-colors bg-transparent text-gray-700"
                  required
                  disabled={isLoading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure du rendez-vous *
                </label>
                <input
                  type="time"
                  name="heureRendezVous"
                  value={formData.heureRendezVous}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-green-500 outline-none transition-colors bg-transparent text-gray-700"
                  required
                  disabled={isLoading}
                  min="08:00"
                  max="18:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialité *
                </label>
                <div className="relative">
                  <select
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-green-500 outline-none transition-colors bg-transparent appearance-none cursor-pointer text-gray-700"
                    required
                    disabled={isLoading}
                  >
                    <option value="" disabled className="text-gray-400">
                      Choisir une spécialité
                    </option>
                    {specializations && specializations.length > 0 ? (
                      specializations.map((specialization) => (
                        <option key={specialization.specialization_id} value={specialization.name}>
                          {specialization.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Aucune spécialité disponible</option>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <small className="text-gray-500 mt-1 block">
                  {specializations.length} spécialité(s) disponible(s)
                </small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du praticien *
                </label>
                <div className="relative">
                  <select
                    name="nomPraticien"
                    value={formData.nomPraticien}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-green-500 outline-none transition-colors bg-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                    required
                    disabled={!formData.specialite || isLoading}
                  >
                    <option value="" disabled className="text-gray-400">
                      {formData.specialite ? 'Choisir un praticien' : 'Sélectionnez d\'abord une spécialité'}
                    </option>
                    {filteredDoctors && filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doctor) => {
                        const doctorName = `Dr. ${doctor.user.first_name} ${doctor.user.last_name}`;
                        return (
                          <option key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                            {doctorName}
                          </option>
                        );
                      })
                    ) : formData.specialite ? (
                      <option disabled>Aucun praticien disponible pour cette spécialité</option>
                    ) : null}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {formData.specialite && (
                  <small className="text-gray-500 mt-1 block">
                    {filteredDoctors.length} praticien(s) disponible(s)
                    {formData.nomPraticien && ` - Sélectionné: ${getDoctorNameById(formData.nomPraticien)}`}
                  </small>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif de Consultation *
              </label>
              <div className="relative">
                <select
                  name="motifConsultation"
                  value={formData.motifConsultation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-green-500 outline-none transition-colors bg-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                  required
                  disabled={!formData.specialite || isLoading}
                >
                  <option value="" disabled className="text-gray-400">
                    {formData.specialite ? 'Veuillez choisir une raison de consultation' : 'Sélectionnez d\'abord une spécialité'}
                  </option>
                  {availableReasons && availableReasons.length > 0 ? (
                    availableReasons.map((reason) => (
                      <option key={reason.reason_id} value={reason.label}>
                        {reason.label}
                      </option>
                    ))
                  ) : formData.specialite ? (
                    <option disabled>Aucune raison disponible pour cette spécialité</option>
                  ) : null}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {formData.specialite && (
                <small className="text-gray-500 mt-1 block">
                  {availableReasons.length} motif(s) disponible(s)
                </small>
              )}
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded bg-gray-50">
                <input
                  type="checkbox"
                  id="robot-check"
                  checked={isRobotVerified}
                  onChange={(e) => setIsRobotVerified(e.target.checked)}
                  className="w-5 h-5 text-green-500 border-2 border-gray-300 rounded focus:ring-green-500"
                  disabled={isLoading}
                />
                <label htmlFor="robot-check" className="text-sm text-gray-700 cursor-pointer">
                  I'm not a robot
                </label>
                <div className="ml-4">
                  <div className="w-8 h-8 border-2 border-blue-500 rounded">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-400 hover:bg-green-500 hover:shadow-lg'
                } text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </span>
                ) : (
                  'Confirmer mon rendez-vous'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;