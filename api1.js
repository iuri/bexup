const axios = require('axios');

// const db = require('./db_conn.js')

const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    //host: '172.17.0.2',
    host: 'localhost',
    database: 'bexup',
    password: 'start',
    port: 51244
})

const queue = []






async function getToken() {
  try {
    const response = await axios.get('http://localhost:5001/getToken');
    // console.log('Response:', response.data.token);
    return response.data.token;

  } catch (error) {
    // console.error('Error sending item:', item);
    // console.error(error);
  }
}

async function sendItem(item) {
    //console.log('Sending Item to API2:', item);
    token = await getToken();
    // console.log('TOKEN ', token)
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    const response = await axios.post('http://localhost:5001/s', item, { headers })
      .then(response => {        
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error sending item:', item);
        console.error(error);
      })
  }



function enqueue(item) {
    queue.push(item);
    // console.log('Item enqueued:', item);
}
  
function dequeue() {
    if (queue.length === 0) {
      // console.log('Queue is empty.');
      return null;
    }
    
    const item = queue.shift();
    // console.log('Item dequeued:', item);
    return item;
}
 


async function processQueue() {
  console.log('Sending Marcas to API2:');
  while (queue.length > 0) {
      // TODOD enhancement 
      // to be changed, to dequeue only if sending was successfull 
      try {
          const item = dequeue(); // Dequeue an item from the queue
          await sendItem(item); // Send the item to another endpoint
      } catch (error) {
          // console.log("Error processing Queue");
          enqueue(item);
      }
  }
}


async function fetchDataAndEnqueue() {
  console.log('Retrieving marcas from FIPE...')
  try {
    const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    // console.log(response.data); // Display the retrieved data in the console
    response.data.forEach(item => {
        enqueue(item)
        // console.log('Item enqueued:', item);
    });

    processQueue();
  } catch (error) {
    // console.error(error);
  }
}









 


function search(keyword) {
  console.log('searching for ' + keyword + ' in the DB... ');

  if (keyword == 'marcas') {
    const jsonData = {'marcas': [
      { codigo: '20', nome: 'Ferrari' },
      { codigo: '21', nome: 'Fiat' },
      { codigo: '149', nome: 'Fibravan' },
      { codigo: '22', nome: 'Ford' },
      { codigo: '190', nome: 'FOTON' },
      { codigo: '170', nome: 'Fyber' },
      { codigo: '199', nome: 'GEELY' },
      { codigo: '23', nome: 'GM - Chevrolet' }
    ]}
    jsonData.marcas.forEach(item => {
      console.log(item)
      
    });
  
  } else {
    const jsonData = {'codigos': [
      { codigo: '20', nome: 'Ferrari', notes: '' },
      { codigo: '21', nome: 'Fiat', notes: ''},
      { codigo: '149', nome: 'Fibravan', notes: '' },
      { codigo: '22', nome: 'Ford', notes: '' },
      { codigo: '190', nome: 'FOTON', notes: '' },
      { codigo: '170', nome: 'Fyber', notes: '' },
      { codigo: '199', nome: 'GEELY', notes: '' },
      { codigo: '23', nome: 'GM - Chevrolet', notes: '' }
    ]}
    jsonData.codigos.forEach(item => {
      console.log(item)
      
    });

  }  


}

// Example usage:
fetchDataAndEnqueue();
search('marcas');
search('codigos');
// console.log(queue)

