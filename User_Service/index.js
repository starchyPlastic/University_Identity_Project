const express = require('express');
const app = express();
const dbconnect = require('./dbconnect.js');
const PersonModel = require('./person_schema.js');

app.use(express.json());


//VIEW API
app.get('/viewprofile', async (req, res) => {   
try {
        const emailid = req.query.emailid || req.body.emailid || req.query.email || req.body.email;

        if (!emailid) {
            return res.status(400).json({ message: "Please provide an emailid to view the profile." });
        }

        const user = await PersonModel.findOne({ emailid: emailid });

        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//UPDATE API
app.put('/Updateprofile', async (req, res) => {
    try {
        const emailid = req.body.emailid || req.body.email;

        if (!emailid) {
            return res.status(400).json({ message: "Please provide an emailid to identify which profile to update." });
        }

        const updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.mobile) updateData.mobile = req.body.mobile;

        const updatedUser = await PersonModel.findOneAndUpdate(
            { emailid: emailid },
            { $set: updateData },
            { new: true } 
        );

        if (updatedUser) {
            return res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
        } else {
            return res.status(404).json({ message: "User not found to update" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5000, () =>
    console.log('EXPRESS Server Started at Port No: 5000'));