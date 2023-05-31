// database connection settings
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: '172.17.0.2',
    // host: '127.0.0.1',
    database: 'bexup',
    password: 'start',
    port: 5432
})
