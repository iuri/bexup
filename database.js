// PGSQL database settings
const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT
})




async function insertData(code, model, brand_code, brand_name) {
    // console.log('Running function saveDataToDatabase() ...')
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

    return 
}

async function search(req, res, item) {
    
    switch (item) {
        case 'brands':
            var query = 'SELECT DISTINCT brand_name FROM vehicles';
            break;
        case 'codes':
            var query = 'SELECT code, name, brand_name, details FROM vehicles';
            
        default:
            var query = 'SELECT DISTINCT brand_name FROM vehicles';
            
    }

    db_pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error '});
            return;
        }
        
        const rows = result.rows;
        // Process the retrieved records
        // console.log('rows:', rows);
        res.json({data: rows});      
    });      
    return 
}

module.exports=pool;