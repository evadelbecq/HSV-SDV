import express from 'express';
import { register, login, verifyToken } from './controllers/userController.js';
import { getAllDoctors, getDoctorById, getAppointmentsByDoctorId, createDoctor } from './controllers/doctorController.js';
import { getAllPatients, getPatientById, getAppointmentsByPatientId, createPatient } from './controllers/patientController.js';
import { getAllAppointments, createAppointment } from './controllers/appointmentController.js';
import { getAllReasonsBySpecializationId, getAllDoctorsBySpecializationId, getAllSpecializations } from './controllers/specializationController.js';

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyToken); 

// Doctor routes
router.get('/doctors', getAllDoctors);
router.get('/doctors/:doctor_id', getDoctorById);
router.get('/doctors/:doctor_id/appointments', getAppointmentsByDoctorId);
router.post('/doctors', createDoctor);

// Patient routes
router.get('/patients', getAllPatients);
router.get('/patients/:user_id', getPatientById);
router.get('/patients/:patient_id/appointments', getAppointmentsByPatientId);
router.post('/patients', createPatient);


router.get('/specializations/:specialization_id/reasons', getAllReasonsBySpecializationId);
router.get('/specializations/:specialization_id/doctors', getAllDoctorsBySpecializationId);
router.get('/specializations', getAllSpecializations);
// Appointment routes
router.get('/appointments', getAllAppointments);
router.post('/appointments', createAppointment);

export default router;