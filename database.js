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


module.exports= { getId }