const express = require("express");
const passport = require('passport')
const connectDB = require("./config/db");
const passport_setup = require('./config/passport')
const app = express();

connectDB();

app.use(passport.initialize());
app.use(passport.session());


app.get('/github',
    passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
        //
    }
);

app.get('/github/callback', passport.authenticate('github'), (req, res) => {
    res.redirect('/')
});


//Middleware: Body Pasrser
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
    console.log(req.user);
    res.send("API is running.. : " + req);
});

//Routes
app.use("/api/auth", require("./routes/api/auth.route"));
app.use("/api/users", require("./routes/api/users.route"));
app.use("/api/profile", require("./routes/api/profile.route"));
app.use("/api/component", require("./routes/api/component.route"));

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(PORT));
