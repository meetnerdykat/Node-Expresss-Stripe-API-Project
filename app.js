// Setup a standard Express server by typing the following code
const express = require('express');
const keys = ('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars Middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));


// Index Route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

// Charge Route
app.post('/charge', (req, res) => {
    const amount = 500000;    
    
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount, 
        description:'Web Design & Development Services',
        currency:'usd',
        customer:customer.id
    }))
    .then(charge => res.render('success'));
});

const port = process.env.Port || 5000;

// code below starts the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Before going further, stop the server I just started with Ctrl + C
// And we don't want to have to keep restarting the server every time I 
// make a change and want to check stuff. So we're gonna install something
// called NodeMon, which will continuously watch our application, and it'll 
// make it so that we don't have to continue watching, starting/stopping the server.
// Make sure to install it globally using the following code: 
// npm install -g nodemon