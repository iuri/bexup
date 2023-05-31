const express = require('express');
const axios = require('axios');

const app = express();
const port = 5001;

app.use(express.json());

app.post('/s', (req, res) => {
  const jsonData = req.body;

  // Process the JSON data
  console.log('Received JSON data:', jsonData);
  processJSONData(jsonData);  
  processQueue();  
  
  // Send a response
  res.status(200).json({ message: 'Data received successfully' });

});




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
    console.log('Processing JSON data:', jsonData);
    enqueue(jsonData);
    // Example: Extract specific properties from the JSON data
  
}




async function processQueue() {
    while (queue.length > 0) {
        // TODOD enhancement 
        // to be changed, to dequeue only if sending was successfull 
        try {
            const item = dequeue(); // Dequeue an item from the queue
            await retrieveData(item); // Send the item to another endpoint
        } catch (error) {
            console.log("Error processing Queue");
            enqueue(item);
        }
    }
}

async function retrieveData(item) {
  console.log('Retrieving Item:', item);
    try {
        const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas/' + item.codigo + '/modelos');
        console.log(response.data); // Display the retrieved data in the console

    // TODO: save data to BD

    } catch (error) {
        console.error(error);
    }
}






app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


