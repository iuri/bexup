require('dotenv').config({path: __dirname + '/.env'})

const { CloudTasksClient } = require('@google-cloud/tasks');

// const client = new CloudTasksClient();
const client = new CloudTasksClient({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });


// Cloud Run URL https://bexup-pepakk62hq-uc.a.run.app
async function createTask() {
    const project = String(process.env.GOOGLE_PROJECT_ID);
    const location = String(process.env.LOCATION_ID);
    const queue = String(process.env.GCP_QUEUE);
  
    const parent = client.queuePath(project, location, queue);
    const task = {
      appEngineHttpRequest: {
        httpMethod: 'POST',
        relativeUri: '/process_brand',
        body: Buffer.from(JSON.stringify({
          order_id: 123456789,
          customer_name: 'bexup',
          order_details: []
        })),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    };
  
    const [response] = await client.createTask({ parent, task });
    console.log(`Task created: ${response.name}`);
  }
  
  createTask().catch(console.error);
  