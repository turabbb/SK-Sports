const jwt = require('jsonwebtoken');
const User = require('../Models/Users');

const generateToken = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return token;
    } catch (error) {
        throw new Error('Error generating token');
    }
}

const verifyToken = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).send({message: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).send({message: "Unauthorized"});
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).send({message: "Unauthorized"});
    }
}

module.exports = {verifyToken, generateToken};