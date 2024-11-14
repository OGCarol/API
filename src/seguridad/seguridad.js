import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

// Veriifcacion del Token
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token no es valido' });
        req.userId = decoded.id;
        next();
    });
};