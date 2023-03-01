if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
//ejs-mate let us set a boilerplate for ejs
//where we can include all of our css and other files
//and use this boilerplate in all the files
//so that we dont have to include them in all the ejs files
const ejsMate = require('ejs-mate')
//javascript validator tool
//using thos we will verify the data before saving it up in mongo
const Joi = require('joi')
//to prevent nosql enjection
const emSanitize = require('express-mongo-sanitize')

//all the routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const authRoutes = require('./routes/auth')

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const ExpressError = require('./utils/expressError')
const mongoDBStore = require('connect-mongo')
// const helmet = require('helmet')

const app = express()

mongoose.set("strictQuery", true);

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1/Yelpcamp'
// const dbUrl = 'mongodb://127.0.0.1/Yelpcamp'
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection error"))
db.once("open", ()=>{
    console.log("Database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static( path.join(__dirname, 'public')))
app.use(emSanitize())

const secret = process.env.SECRET || "randomstrongsecret";
const store = mongoDBStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24*60*60
})
store.on('error', function(e){
    console.log('Session Store Error',e)
})
const sessionConfig = {
    store:store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //for security(read docs)
        httpOnly: true,
        //Date changes every milli second so we need to calculate milli seconds in a week
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

//login and signup setup using passport
app.use(passport.initialize())
app.use(passport.session())
app.use(emSanitize({
    replaceWith:"_"
}));
// app.use(helmet({
//     contentSecurityPolicy:false,
// }));
passport.use(new LocalStrategy(User.authenticate()))
//telling passport how to serilize(how to we store the user data in session) the user
passport.serializeUser(User.serializeUser())
//how to get user out of a session
passport.deserializeUser(User.deserializeUser())

//so that we dont have to send msg to each template seperately
app.use((req,res,next)=>{
    //this all are like global variables
    //req.user is from passport it stores all the information of the user from session in user and can be accessed with req.user
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', authRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page not found', 404))
})

//error handling
app.use((err, req, res, next)=>{
    const { statusCode = 500} = err
    if(!err.message) err.message = 'Oh No, Something went wrong'
    res.status(statusCode).render('error', {err})

})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})