const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');

// Set up the port we're going to use
const port = process.env.PORT || 3000;

// Create our express app
const app = express();

// Set up the static directory
app.use(express.static(__dirname + '/public'));

// Define the storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },


    // Let's add the file extensions back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.get('/', (req, res) => {
    console.log(`Connection to UI interface from: ${req.hostname}`);
    res.sendFile(path.resolve('./public/index.html'));
});

app.post('/upload-file', (req, res) => {
    // 'file' is the name of the file inut field in the HTML form
    let upload = multer({ storage: storage }).single('file');

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            console.log("File validation error: " + err);
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            console.log("No file founded error: " + err);
            return res.send('Por favor selecciona un archivo para subir');
        } else if (err instanceof multer.MulterError) {
            console.log("Multer error: " + err);
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        // Display uploaded file for user validation
        res.send(`You have uploaded this file:  ${req.file.filename}<hr/><a href="./">Upload another file</a>`);
    });
});

app.post('/upload-files', (req, res) => {
    // 'files' is the name of the file input field in the HTML form
    let upload = multer({ storage: storage }).array('multiple-files');

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            console.log("File validation error: " + err);
            return res.send(req.fileValidationError);
        } else if (!req.files) {
            console.log("No files were found error: " + err);
            return res.send('Por favor selecciona una imagen para subir');
        } else if (err instanceof multer.MulterError) {
            console.log("Multer error: " + err);
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        let result = "Images: <hr />";
        const files = req.files;
        // LOop through all the uploaded images and display their name on frontend
        for (let index = 0, len = files.length; index < len; index++) {
            result += `<hr /> <p>${files[index].filename}<p/>`;
        }
        result += "<hr/> <p>Were successfuly uploaded<p/>"
        result += '<hr/> <a href="./">Upload more images </a>';
        res.send(result);
    });
});

app.listen(port, () => console.log(`Listening on port :${port}`));