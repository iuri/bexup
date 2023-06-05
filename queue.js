const axios = require('axios');

const db_pool = require('./db_conn.js');
const { getId, insertModel, updateModel  } = require('./database.js');
const queue = [];

function enqueue(item) {
    queue.push(item);
    console.log('Item enqueued:', item);
    return;
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




async function processQueue() {
    while (queue.length > 0) {
        // TODOD enhancement 
        // to be changed, to dequeue only if sending was successfull 
        try {
            const item = dequeue(); // Dequeue an item from the queue
            const jsonData = await getDataFromFIPE(item); // Send the item to another endpoint

            console.log('jsonData', jsonData)
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
    // console.log('Running function saveDataToDatabase() ...')
    insertModel(code, title, brand_code, brand_title);
}
  
  

module.exports = { enqueue, processQueue }