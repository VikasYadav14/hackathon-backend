const db = require('../../../../config/dbConnection')
const User = require('../../../../config/models/Users');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_Secret = process.env.JWT_SECRET

const loginRegister = {

    register: async (req, res) => {
        try {

            const { username, password } = req.body;

            let user = await User.findOne({ username });
            if (user) return res.status(400).json('User already exists.')

            user = new User({
                username,
                password
            })

            await user.save();

            // for it sign in write after it get register so 
            const payload = {
                user: {
                    id: user.email,
                },
            };

            const token = await jwt.sign(payload, jwt_Secret, { expiresIn: 3600 })
            if (!token) throw console.error("no token has been generated.");
            return res.status(201).json({ token });

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    logIn: async (req, res) => {
        try {

            let {username, password} = req.body;

            let user = await User.findOne({username});

            if(!user)  return res.status(200).json({msg: "user do not exists."});

            let isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch) return res.status(200).json({msg: "password didn't match. please try again"});

            const payload = {
                user: {
                    id: user.email,
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