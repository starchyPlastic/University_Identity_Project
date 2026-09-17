const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const dbconnect = require('./dbconnect.js');
const jwt = require('jsonwebtoken')
const PersonModel = require('./person_schema.js');
require('dotenv').config();

app.use(express.json());

const JWT_SECRETE = process.env.JWT_SECRETE;

app.post("/login", async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.role);

    try {
      const existingUser = await PersonModel.findOne({ 
            emailid: req.body.email, 
            role: req.body.role 
        });
        if (!existingUser) {
            return res.status(400).send({ message: "Invalid email or role" });
        }
    const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.pass);
  if (!isPasswordValid) {
            return res.status(400).send({ message: "Invalid password" });
        }
      const token = jwt.sign(
            { email: existingUser.emailid, role: existingUser.role }, 
            JWT_SECRETE, 
            { expiresIn: '24h' }
        );
        return res.json({ token });
  } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({ message: "Internal server error" });
}
});

app.listen(5002, () => {
    console.log('Authentication Service Server is running on PORT NO: 5002')
})
