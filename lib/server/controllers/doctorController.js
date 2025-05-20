import { Doctor, User, Appointment, Specialization } from '../models/index.js';

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Specialization, as: 'specialization' }
      ]
    });
    res.json(doctors);
  } catch (error) {
    console.error('Error getting doctors:', error);
    res.status(500).json({ message: 'Error retrieving doctors', error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await Doctor.findByPk(doctor_id, {
      include: [
        { model: User, as: 'user' },
        { model: Specialization, as: 'specialization' }
      ]
    });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error getting doctor:', error);
    res.status(500).json({ message: 'Error retrieving doctor', error: error.message });
  }
};

export const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const appointments = await Appointment.findAll({
      where: { doctor_id },
      include: [
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user' }] },
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user' }] }
      ]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { user_id, specialization_id } = req.body;
    
    // Check if user exists
    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if doctor record already exists for this user
    const existingDoctor = await Doctor.findOne({ where: { user_id } });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor record already exists for this user' });
    }
    
    const doctor = await Doctor.create({
      user_id,
      specialization_id
    });
    
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Error creating doctor', error: error.message });
  }
};