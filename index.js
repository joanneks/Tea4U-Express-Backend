const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on');
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
  });
const moment = require('moment');
moment().format();

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

require('dotenv').config();
const app = express();
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

app.use(session({
  store: new FileStore(),  // we want to use files to store sessions
  secret: process.env.SESSION_SECRET, // used to generate the session id
  resave: false, // do we automatically recreate the session even if there is no change to it
  saveUninitialized: true, // if a new browser connects do we create a new session
}))

app.use(flash());

app.set('view engine', 'hbs');
app.use(express.urlencoded({
  extended: false
}))

app.use(express.static('public/images')); 

// setup a middleware to inject the session data into the hbs files
app.use(function(req,res,next){
  // res.locals will contain all the variables available to hbs files
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})

// setup middleware to save user details into session to share data across all hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next()
})

// setup middleware to save cartCount into session to share data across all hbs files
app.use(async function(req,res,next){
  if(req.session.user){
    const cartItems = await getCartByUserId(req.session.user.id);
    res.locals.cartCount = cartItems.toJSON().length;
  }
  next();
})

// const api = {
//   customers: require('./routes/api/customer')
// }

// register api routes
// app.use('/api/customer',express.json(),api.customer)

const cloudinaryRoutes = require('./routes/cloudinary');
const teaRoutes = require('./routes/tea');
const brandRoutes = require('./routes/brand');
const tasteProfileRoutes = require('./routes/taste-profile');
const placeOfOriginRoutes = require('./routes/place-of-origin');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const { getCartByUserId } = require('./dal/cart');

app.use('/cloudinary', cloudinaryRoutes);
app.use('/tea',teaRoutes);
app.use('/brand',brandRoutes);
app.use('/taste-profile',tasteProfileRoutes);
app.use('/place-of-origin',placeOfOriginRoutes);
app.use('/user',userRoutes);
app.use('/cart',cartRoutes);


app.use(express.static('public'))

app.listen(3000,function (res,req){
    console.log("Server started")
})