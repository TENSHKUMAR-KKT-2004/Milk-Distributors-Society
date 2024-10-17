const path = require('path')
const express = require('express')
const session = require('express-session')
require("dotenv").config();

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const milkersRoutes = require('./routes/milkersRoutes');
const cowOwnersRoutes = require('./routes/cowOwnersRoutes');
const milkEntryRoute = require('./routes/milkEntryRoutes');
const feedRoutes = require('./routes/feedRoutes');
const milkCompanyRoutes = require('./routes/milkCompanyRoutes');

// Set up Express app
const expressApp = express()
expressApp.set('view engine', 'ejs')
expressApp.set("views", path.join(__dirname, "renderer"));
expressApp.use(express.static(path.join(__dirname, "assets")));

expressApp.use(express.json());
expressApp.use(express.urlencoded({
    extended: true
}));

expressApp.use(session({
    secret: "hiherh3r3y98rfhf94t4y59r8ih4t78ry",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// APP ROUTES
expressApp.use('/auth', authRoutes);
expressApp.use(milkersRoutes)
expressApp.use(cowOwnersRoutes)
expressApp.use(milkEntryRoute)
expressApp.use(feedRoutes)
expressApp.use(milkCompanyRoutes)

expressApp.get('/', (req, res) => {
    res.render('index')
})

expressApp.get('/dashboard', authMiddleware, (req, res) => {
    res.render('dashboard')
})

expressApp.get('/add-loan', authMiddleware, (req, res) => {
    res.render('add-loan')
})

const server = expressApp.listen(52331, () => {
    console.log(`Express server is running on http://localhost:52331`)
})