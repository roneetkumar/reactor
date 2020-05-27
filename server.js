const express = require("express");
const passport = require('passport')
const connectDB = require("./config/db");
const app = express();
require('./config/passport')

connectDB();

app.use(passport.initialize());
app.use(passport.session());


app.get('/github',
    passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
        //
    }
);


app.get('/github/callback', passport.authenticate('github'), (reqs, res) => {
    res.redirect(307, '/api/profile')

});



//Middleware: Body Pasrser
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
    res.send("API is running.. : ");
});

//Routes
app.use("/api/auth", require("./routes/api/auth.route"));
app.use("/api/users", require("./routes/api/users.route"));
app.use("/api/profile", require("./routes/api/profile.route"));
app.use("/api/component", require("./routes/api/component.route"));

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(PORT));
