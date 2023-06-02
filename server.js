require('dotenv').config({path: __dirname + '/.env'})

const express = require('express');
const axios = require('axios');

//TODO: to implement JWT properly
///
/// Security implementation
///
const { generateToken, verifyToken } = require('./jwt.js');


const db_pool = require('./db_conn.js');

const app = express();
const port = 8080;
app.use(express.json());



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



app.get('/getToken', (req, res) => {
    console.log('Running function getToken...');
    // Generate a token
    // forced authentication with statis credentials 
    const payload = { userId: 123, username: 'john.doe' };
    const token = generateToken(payload);
    
    // Send a response
    res.status(200).json({ 'token': token });  
});
  
  



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
            const jsonData = await retrieveData(item); // Send the item to another endpoint

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

async function retrieveData(item) {
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


async function saveDataToDatabase(code, model, brand_code, brand_name) {
   console.log('Running function saveDataToDatabase() ...')
   //
   // TODO: to migrate to Cloud SQL
   // TODO: To remove SQL from js file. Add a function to wrap them up!; 
   //
   const query = 'INSERT INTO vehicles (code, model, brand_code, brand_name) VALUES ($1, $2, $3, $4)'
    const values = [parseInt(code), String(model), parseInt(brand_code), String(brand_name)]

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



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


