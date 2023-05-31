const axios = require('axios');

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
 
async function fetchDataAndEnqueue() {
  try {
    const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    // console.log(response.data); // Display the retrieved data in the console
    response.data.forEach(item => {
        enqueue(item)
        console.log('Item enqueued:', item);
    });

    processQueue();
  } catch (error) {
    console.error(error);
  }
}


async function processQueue() {
    while (queue.length > 0) {
        // TODOD enhancement 
        // to be changed, to dequeue only if sending was successfull 
        try {
            const item = dequeue(); // Dequeue an item from the queue
            await sendItem(item); // Send the item to another endpoint
        } catch (error) {
            console.log("Error processing Queue");
            enqueue(item);
        }
    }
}

async function sendItem(item) {
    console.log('Sending Item:', item);
    try {
      const response = await axios.post('http://localhost:5001/s', item);
      console.log('Item sent:', item);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending item:', item);
      console.error(error);
    }
  }


 
// Example usage:
fetchDataAndEnqueue();
// console.log(queue)

