const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: envFile });

const express = require('express');
const connectDB = require('./db/db');
const cors = require('cors');
const http = require('http');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello from Uber BE');
});

app.use('/users', userRoutes);


const server = http.createServer(app);

connectDB()
    .then(() => {
        console.log("Database connection established...");
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!!");
        process.exit(1);
    });