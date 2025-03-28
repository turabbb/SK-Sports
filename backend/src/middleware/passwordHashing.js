const bcrypt = require('bcrypt');

const hashPassword = async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
};

const comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = {comparePassword, hashPassword};