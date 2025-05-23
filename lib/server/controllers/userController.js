import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import bcrypt from 'bcrypt';

const getUserRole = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await User.findOne({
            where: { user_id },
            include: [
                { model: Patient, as: 'patient' },
                { model: Doctor, as: 'doctor', include: [{ model: Specialization, as: 'specialization' }] }
            ]
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        let role = 'unknown';
        let roleData = null;
        
        if (user.patient) {
            role = 'patient';
            roleData = user.patient;
        } else if (user.doctor) {
            role = 'doctor';
            roleData = {
                ...user.doctor.dataValues,
                specialization: user.doctor.specialization ? user.doctor.specialization.name : null
            };
        }
        
        res.status(200).json({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            role,
            roleData
        });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res) => {
    const { first_name, last_name, email, password, phone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ 
            where: { email },
            include: [
                { model: Patient, as: 'patient' },
                { model: Doctor, as: 'doctor' }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        let role = 'unknown';
        if (user.patient) {
            role = 'patient';
        } else if (user.doctor) {
            role = 'doctor';
        }

        const token = jwt.sign({ user_id: user.user_id, role}, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token, role });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: `Failed to authenticate token : ${token}` });
        }
        req.user_id = decoded.user_id;
        req.role = decoded.role;
        res.status(200).json({ message: 'Token is valid', user_id: req.user_id, role: req.role });
        next();
    });
}




export { register, login, getUserRole, verifyToken };