const db = require('../../../../config/dbConnection')
const User = require('../../../../config/models/Users');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_Secret = process.env.JWT_SECRET


const loginRegister = {

    register: async (req, res) => {
        try {

            const { email, password } = req.body;

            let user = await User.findOne({ email });
            if (user) return res.status(400).json('User already exists.')

            user = new User({
                email,
                password
            })

            await user.save();

            // for it sign in write after it get register so 
            const payload = {
                user: {
                    id: user.id,
                },
            };

            const token = await jwt.sign(payload, jwt_Secret, { expiresIn: 3600 })
            if (!token) throw console.error("no token has been generated.");
            return res.status(201).json({ token });

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

module.exports = loginRegister