const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express();

app.use(express.static('public'));
app.set("view engine","hbs");
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended:false
}))


const productRoutes = require('./routes/products');

// app.get('/',function(req,res){
//     res.send("It's alive!!!")
// })
app.use('/products',productRoutes)

app.listen(3000,function (){
    console.log("Server started")
})