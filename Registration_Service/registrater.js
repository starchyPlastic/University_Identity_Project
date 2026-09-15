const express = require('express');
var app = express();
const bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const PersonModel = require('./person_schema.js');
const saltRounds = 10;

/*
In the postman use the following URL
localhost:5000/reg

{
  "firstname":"Joe",
  "email":"a@gmail.com",
  "password":"abc",
  "mobile": 12345678,
  "role": "student"
}

*/

function uniqueid(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

//REG API
app.post('/userregister', async (req, res) => {
  console.log("REG API EXECUTED")
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
          const existingUser = await PersonModel.findOne({ emailid: req.body.email });
        if (existingUser) {
            return res.status(409).send({ message: "Duplicate Email: User already exists." });
        }
  const pobj = new PersonModel({
    id: uniqueid(1000, 9999),
    name: req.body.firstname,
    emailid: req.body.email,
    pass: hashedPassword,
    mobile: req.body.mobile,
    role: req.body.role
  });//CLOSE PersonModel
  
  //INSERT/SAVE THE RECORD/DOCUMENT
  pobj.save()
    .then(inserteddocument => {
      res.status(200).send('DOCUMENT INSERED IN MONGODB DATABASE');
    })//CLOSE THEN
    .catch(err => {
      res.status(500).send({ message: err.message || 'Error in Employee Save ' })
    });//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
);//CLOSE POST METHOD

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5003, () => console.log('EXPRESS Server Started at Port No: 5003'));
