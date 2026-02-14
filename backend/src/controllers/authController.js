import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Registrar nuevo usuario (solo admin)
// @route   POST /api/auth/register
// @access  Private/Admin
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear usuario
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Autenticar usuario
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (!user.active) {
                return res.status(401).json({ message: 'Usuario desactivado' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obtener perfil de usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
