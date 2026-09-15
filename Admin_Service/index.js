const express = require('express');
const app = express();
const dbconnect = require('./dbconnect.js');
const PersonModel = require('./person_schema.js');
app.use(express.json());

app.get('/searchuser', async (req, res) => {

    try {
        const name = req.query.name || req.body.name;
        const emailid = req.query.emailid || req.body.emailid || req.query.email || req.body.email;
        let query = {};
        if (name && emailid) {
            query = { $or: [{ name: name }, { emailid: emailid }] };
        } else if (name) {
            query = { name: name };
        } else if (emailid) {
            query = { emailid: emailid };
        } else {
            return res.status(400).json({ message: "Please provide a name or email to search." });
        }

        const users = await PersonModel.find(query);

        if (users && users.length > 0) {
            return res.status(200).json({ message: "User(s) found", data: users });
        } else {
            return res.status(404).json({ message: "User Not Found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

//VIEW API
app.get('/viewalluser', async (req, res) => {

try {
        // Execute MongoDB Search for all documents
        const users = await PersonModel.find({});
        
        if (users && users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ message: "No users exist in the database." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

//UPDATE API
app.delete('/deluser', async (req, res) => {
       try {
        const emailid = req.query.emailid || req.body.emailid || req.query.email || req.body.email;
        
        if (!emailid) {
            return res.status(400).json({ message: "Please provide an emailid to delete." });
        }

        const deletedUser = await PersonModel.findOneAndDelete({ emailid: emailid });

        if (deletedUser) {
            return res.status(200).json({ message: "User deleted successfully", deletedUser: deletedUser });
        } else {
            return res.status(404).json({ message: "User not found to delete" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5001, () =>
    console.log('EXPRESS Server Started at Port No: 5001'));


