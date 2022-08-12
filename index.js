const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on');
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
  });
const moment = require('moment');
moment().format();

require('dotenv').config();
const app = express();
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

app.set('view engine', 'hbs');
app.use(express.urlencoded({
  extended: false
}))

const cloudinaryRoutes = require('./routes/cloudinary');
const teaRoutes = require('./routes/tea');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');

app.use('/cloudinary', cloudinaryRoutes);
app.use('/tea',teaRoutes);
app.use('/user',userRoutes);
app.use('/cart',cartRoutes);


app.listen(3000,function (res,req){
    console.log("Server started")
})