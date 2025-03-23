const express = require('express'); 
const fs = require('fs'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 

const app = express(); 
const PORT = 3000; 
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname));


app.post('/submit', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password; 

    
    const userData = `Username: ${username}, Password: ${password}\n`;
    fs.appendFile('users.txt', userData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error saving user data.');
            return;
        }
        
        res.redirect('/');
    });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
