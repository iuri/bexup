require('dotenv').config({path: __dirname + '/.env'})


const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

// PGSQL implementation 
const db_pool = require('./db_conn.js');
const { updateModel  } = require('./database.js');

///
// API
//
const { getModels, getBrands, search } = require('./api.js');

//TODO: to implement JWT properly
///
/// Security implementation
///
const { generateToken, verifyToken } = require('./jwt.js');

///
// Queue implementation
///
const { enqueue, processQueue } = require('./queue.js');


const app = express();
const port = 8080;
app.use(express.json());

// middleware tpo parse body reuqest using best practices
app.use(bodyParser.json());


app.post('/add', (req, res) => {
    const jsonData = req.body;
    const header = req.headers.authorization;
    // console.log('Authorization', header);

    if (verifyToken(String(header).split(' ')[1]) != '') {
        // Process the JSON data
        // console.log('Received JSON data:', jsonData);
        enqueue(jsonData);  
        processQueue();  

        // Send a response
        res.status(200).json({ message: 'Success' });

    } else {
        // Send a response
        res.status(498).json({ message: 'Invalid Token!'});
    }
});



///
// Update data
///
app.post('/update', (req, res) => {
    const jsonData = req.body;
    const header = req.headers.authorization;
    // console.log('Authorization', header);

    if (verifyToken(String(header).split(' ')[1]) != '') {
        // Process the JSON data
        console.log('Received JSON data:', jsonData);
        updateModel(jsonData.code, jsonData.title, jsonData.brand_title, jsonData.notes).then(result => {
            if (result) {
                // Send a response
                res.status(200).json({ message: result });
            }            
        });  
        

    } else {
        // Send a response
        res.status(498).json({ message: 'Invalid Token!'});
    }
});





app.get('/api/search/marcas', (req, res) => {
    console.log('Running search marcas ');
    ////
    // TODO: remove CORS and crete proper chunk
    ////
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    getBrands(req, res);
    return; 
});

///
// API method to search for models/vehicles,
// from a specific brand passed in the request
////
app.post('/api/search/modelos', (req, res) => {
    console.log('Running search modelos ');
    ////
    // TODO: remove CORS and crete proper chunk
    ////
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    getModels(req,res);
    return;
});


app.get('/getToken', (req, res) => {
    console.log('Running function getToken...');
    // Generate a token
    // forced authentication with statis credentials 
    const payload = { userId: 123, username: 'john.doe' };
    const token = generateToken(payload);
    

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


    // Send a response
    res.status(200).json({ 'token': token });  
});
  


app.post('/login', (req, res) => {
    console.log('Running function getToken...');
    // Generate a token
    // forced authentication with statis credentials 
    console.log('reqbody', req.body);
    const payload = { userId: 123, username: 'john.doe' };
    const token = generateToken(payload);
    

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


    // Send a response
    res.status(200).json({
        'token': token, 
        'user': {
            'id': 87654,
            'firstNames': 'Iuri', 
            'lastName': 'de Araujo',
            'email': req.body.email
        }
    });  
});


// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});





app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
  
  