const express = require('express');

const connectDB = require('./config/db');

const app = express();

connectDB();


//Middleware: Body Pasrser
app.use(express.json({ extended: false }));

//Routes
app.use('/api/auth', require('./routes/api/auth'))
// app.use('/api/users', require('./routes/api/users'))
// app.use('/api/profile', require('./routes/api/profile'))
// app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(PORT))