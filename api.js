
//TODO: to implement JWT properly
///
/// Security implementation
///
const { generateToken, verifyToken } = require('./jwt.js');

// PGSQL implementation 
const db_pool = require('./db_conn.js');


////////
/// Search
////



function search(req, res, type) {
    // console.log('body', req.body);
    query = '';
    switch (type) {
        case 'brands':
            query = 'SELECT DISTINCT brand_name FROM models';
            break;
        case 'models':
            code = req.body.code, type;
            query = 'SELECT code, title, brand_title, notes FROM models WHERE brand_code = ' + code; 
            break;                
        default:
            query = 'SELECT DISTINCT brand_code, brand_title FROM models';        
    }


    try {
        db_pool.query(query, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Internal Server Error: Inexistent id'});
                return;
            }
            
            const rows = result.rows;
            // Process the retrieved records
            // console.log('rows:', rows);
            res.json({data: rows});      
    
        });      

    } catch (error) {
        console.log("Internal Error");
        res.status(500).json({ error: 'Internal Server Error '});
    }
           
    return 
}


const getModels = (req, res) => {
  const header = req.headers.authorization;
  if (typeof header == 'undefined') {
      // console.log('Wrong request! No header.');
      // Send a response
      res.status(401).json({ message: 'unathorized' });
      return;
  }

  // console.log(header);
  console.log(verifyToken(String(header).split(' ')[1]))
  if (verifyToken(String(header).split(' ')[1]) == null) {
    res.status(401).json({ message: 'Invalid Token. Request a new one' });
    return;
  }
  search(req, res, 'models');
}

const getBrands = (req, res) => {
    const header = req.headers.authorization;
    if (typeof header == 'undefined') {
        // console.log('Wrong request! No header.');
        // Send a response
        res.status(401).json({ message: 'unathorized' });
        return;
    }

    // console.log(header);
    if (verifyToken(String(header).split(' ')[1]) != '') {
        search(req, res, 'marcas');
    } 


}
module.exports={ getModels, getBrands, search }