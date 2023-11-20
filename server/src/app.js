const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8000;
const userRouter = require('./routes/user');
const customerTaxCommentsRouter = require('./routes/customerTaxComments');
const customerTaxDocumentsRouter = require('./routes/customerTaxDocuments');
const customerTaxInputs = require('./routes/customerTaxInputs');
const taxInputs = require('./routes/taxInputs');
const taxDocuments = require('./routes/taxDocuments');

app.use(express.urlencoded({ extended: true }));

app.use(express.json())

app.use(cors());

// File Uploading with multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

//File uploading
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (req.file) {
            res.send({
                status: true,
                message: "File Uploaded!",
            });
            console.log(req.file)
        } else {
            res.status(400).send({
                status: false,
                data: "File Not Found :(",
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


// Error handling middleware with the `err` parameter
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', success: false });
    // Remove the next() call here
});

// Mount the user router
app.use('/user', userRouter);

// Mount the customer tax comment router
app.use('/customer-tax-comment', customerTaxCommentsRouter);

// Mount the customer tax comment router
app.use('/customer-tax-document', customerTaxDocumentsRouter);

// Mount the customer tax inputs
app.use('/customer-tax-inputs', customerTaxInputs);

// Mount the tax inputs
app.use('/tax-inputs', taxInputs);

// Mount the tax documents
app.use('/tax-documents', taxDocuments);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
