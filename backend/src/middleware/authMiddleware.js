const jwt = require('jsonwebtoken');
const User = require('../Models/Users');

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
        return token;
    } catch (error) {
        throw new Error('Error generating token');
    }
}

const verifyToken = async (req,res,next) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {verifyToken, generateToken};