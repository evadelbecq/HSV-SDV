import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
                },
   
            ]
        });
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getPatientById = async (req, res) => {
    const { user_id } = req.params;
    try {
        const patient = await Patient.findOne({
            where: { user_id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
                },
               
            ]
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

const createPatient = async (req, res) => {
    const { user_id } = req.body;
    try {
        const newPatient = await Patient.create({
            user_id
        });
        res.status(201).json(newPatient);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getAppointmentsByPatientId = async (req, res) => {
    const { patient_id } = req.params;
    try {
        const appointments = await Appointment.findAll({
            where: { patient_id },
            include: [
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
                }
            ]
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { getAllPatients, getPatientById, getAppointmentsByPatientId, createPatient };