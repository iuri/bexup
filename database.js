// PGSQL database settings
const { Pool } = require('pg')
const db_pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT
})


const getId = (code, type) => {
    // console.log('Running function getID...');
    // console.log('type: ', type, 'code: ', code);

    query = 'SELECT id FROM ' + type + ' WHERE code = ' + code;

    db_pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return -1;
        }
        
        const rows = result.rows;
        if (rows.length > 1 ) {
            console.log('Error: more than 1 id')
            return -1;
        }
        // Process the retrieved records
        console.log('rows ID:', rows[0].id);
        return rows[0].id;
    });      

    return;
};

const insertModel = async (code, title, brand_code, brand_title) => {
    const query = 'INSERT INTO models (code, title, brand_code, brand_title) VALUES ($1, $2, $3, $4)'
    const values = [parseInt(code), String(title), parseInt(brand_code), String(brand_title)]

    try {
        const client = await db_pool.connect();
        await client.query(query, values);
        client.release();
        console.log('Data saved to the database');
        return;

    } catch (error) {
        console.error('Error saving data to the database.', error);
        return 1;
    }
    
};


const updateModel = async (code, title, brand_code, brand_title) => {
    const query = 'UPDATE models SET code = $1, title = $2, brand_code = $3, brand_title = $4';
    const values = [parseInt(code), String(title), parseInt(brand_code), String(brand_title)];

    try {
        const client = await db_pool.connect();
        await client.query(query, values);
        client.release();
        return;

    } catch (error) {
        console.error('Error saving data to the database.', error);
        return 1;
    }
    
};


module.exports= { getId, insertModel, updateModel}