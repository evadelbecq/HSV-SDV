import Specialization from '../models/Specialization.js';
import Reason from '../models/Reason.js';

export const getAllSpecializations = async (req, res) => {
    try {
        const specializations = await Specialization.findAll({
            include: [
                {
                    model: Reason,
                    as: 'reasons',
                    attributes: ['reason_id', 'name']
                }
            ]
        });
        res.status(200).json(specializations);
    } catch (error) {
        console.error('Error fetching specializations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllReasonsBySpecializationId = async (req, res) => {
    const { specialization_id } = req.params;
    try {
        const reasons = await Reason.findAll({
            where: { specialization_id },
            attributes: ['reason_id', 'name']
        });
        if (!reasons) {
            return res.status(404).json({ message: 'No reasons found for this specialization' });
        }
        res.status(200).json(reasons);
    } catch (error) {
        console.error('Error fetching reasons:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllDoctorsBySpecializationId = async (req, res) => {
    const { specialization_id } = req.params;
    try {
        const doctors = await Doctor.findAll({
            where: { specialization_id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone']
                }
            ]
        });
        if (!doctors) {
            return res.status(404).json({ message: 'No doctors found for this specialization' });
        }
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}