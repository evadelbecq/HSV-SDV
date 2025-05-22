import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: ['patient_id', 'first_name', 'last_name']
                },
                {
                    model: Doctor,
                    as: 'doctor',
                    attributes: ['doctor_id', 'first_name', 'last_name']
                },    
            ]
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const createAppointment = async (req, res) => {
    const { patient_id, doctor_id,reason_id, start_date, end_date } = req.body;
    try {
        const newAppointment = await Appointment.create({
            patient_id,
            doctor_id,
            reason_id,
            start_date,
            end_date
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { getAllAppointments, createAppointment };