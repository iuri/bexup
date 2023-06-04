require('dotenv').config({path: __dirname + '/.env'})


const express = require('express');
const { Pool } = require('pg'); 
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

// PGSQL implementation 
const db_pool = require('./db_conn.js');
 const { getId  } = require('./database.js');


//TODO: to implement JWT properly
///
/// Security implementation
///
const { generateToken, verifyToken } = require('./jwt.js');




const app = express();
const port = 8080;
app.use(express.json());

// middleware tpo parse body reuqest using best practices
app.use(bodyParser.json());


app.post('/s', (req, res) => {
    const jsonData = req.body;

    const header = req.headers.authorization;

    console.log('Authorization', header);

    decodedToken = verifyToken(String(header).split(' ')[1]);
    console.log(decodedToken);
    // Process the JSON data
    console.log('Received JSON data:', jsonData);
    processJSONData(jsonData);  
    msg = processQueue();  

    // Send a response
    res.status(200).json({ message: msg });
/*     if (decodedToken > 0) {

        // Process the JSON data
        console.log('Received JSON data:', jsonData);
        processJSONData(jsonData);  
        msg = processQueue();  

        // Send a response
        res.status(200).json({ message: msg });

    } else {
        // Send a response
        res.status(498).json({ message: 'Invalid Token!'});
    }
*/
});

app.get('/api/search/marcas', (req, res) => {
    console.log('Running search marcas ');
    search(req, res, 'marcas');
    // return 
});

app.post('/api/search/modelos', (req, res) => {
    console.log('Running search modelos ');
    search(req, res, 'models');
    // return 
});


app.get('/getToken', (req, res) => {
    console.log('Running function getToken...');
    // Generate a token
    // forced authentication with statis credentials 
    const payload = { userId: 123, username: 'john.doe' };
    const token = generateToken(payload);
    
    // Send a response
    res.status(200).json({ 'token': token });  
});
  
  








// TODO: move the chunk below to separated files


////
/// Synchronize Data API1, FIPE and PGSQL
////
const queue = []
function enqueue(item) {
    queue.push(item);
    console.log('Item enqueued:', item);
}
  
function dequeue() {
    if (queue.length === 0) {
      console.log('Queue is empty.');
      return null;
    }
    
    const item = queue.shift();
    console.log('Item dequeued:', item);
    return item;
}

function processJSONData(jsonData) {
    // Perform processing on the JSON data
    // console.log('Processing JSON data:', jsonData);
    enqueue(jsonData);
    // Example: Extract specific properties from the JSON data
  
}




async function processQueue() {
    while (queue.length > 0) {
        // TODOD enhancement 
        // to be changed, to dequeue only if sending was successfull 
        try {
            const item = dequeue(); // Dequeue an item from the queue
            const jsonData = await getDataFromFIPE(item); // Send the item to another endpoint

            // console.log('jsonData', jsonData)
            jsonData.modelos.forEach(m => {
                // item is a json obj representing a brand. Each brand has codigo and name
                // Object m represents a model, which has codigo and nome too 
                saveDataToDatabase(m.codigo, m.nome, item.codigo, item.nome).then(() => {
                    // Sending response
                    return 'Data saved successfully!';
                })
                .catch((error) => {
                    console.error('Error saving data', error);
                    return 'Error saving data';
                })                
            });
        
        

           
        } catch (error) {
            console.log("Error processing Queue");
            enqueue(item);
        }
    }
}

async function getDataFromFIPE(item) {
  console.log('Retrieving Item:', item);
    try {
        const response = await axios.get(process.env.API_FIPE_URL+'carros/marcas/' + item.codigo + '/modelos');
        // console.log(response.data); // Display the retrieved data in the console
        return response.data
    // TODO: save data to BD

    } catch (error) {
        console.error(error);

    }
}


async function saveDataToDatabase(code, title, brand_code, brand_title) {
   console.log('Running function saveDataToDatabase() ...')
   //
   // TODO: to migrate to Cloud SQL
   // TODO: To remove SQL from js file. Add a function to wrap them up!; 
   //
   const query = 'INSERT INTO models (code, title, brand_code, brand_title) VALUES ($1, $2, $3, $4)'
    const values = [parseInt(code), String(title), parseInt(brand_code), String(brand_title)]

    try {
        const client = await db_pool.connect();
        await client.query(query, values);
        client.release();
        // console.log('Data saved to the database', values);
        return 'Data saved to the database';

    } catch (error) {
        console.error('Error saving data to the database.', error);
    }
}




/* 
app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8080', // original url
    changeOrigin: true,
    //secure: false,
    onProxyRes: function(proxyRes, req, res) {
        proxyRes,headers['Access-Control-Allow-Origin'] = '*';
    }
}));

*/






////////
/// Search
////



function search(req, res, type) {
    // console.log('body', req.body);
    query = '';
    switch (type) {
        case 'brands':
            query = 'SELECT DISTINCT brand_name FROM models';
            break;
        case 'models':
            code = req.body.code, type;
            query = 'SELECT code, title, brand_title, notes FROM models WHERE brand_code = ' + code; 
            break;                
        default:
            query = 'SELECT DISTINCT brand_title FROM models';        
    }


    try {
        db_pool.query(query, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Internal Server Error: Inexistent id'});
                return;
            }
            
            const rows = result.rows;
            // Process the retrieved records
            // console.log('rows:', rows);
            res.json({data: rows});      
    
        });      

    } catch (error) {
        console.log("Internal Error");
        res.status(500).json({ error: 'Internal Server Error '});
    }
           
    return 
}




app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
  
  