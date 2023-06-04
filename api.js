
//TODO: to implement JWT properly
///
/// Security implementation
///
const { generateToken, verifyToken } = require('./jwt.js');


function getToken(req, res) {
    console.log('Running function getToken...');
    // Generate a token
    // forced authentication with statis credentials 
    // TODO to add chunk to receive user and password
    const payload = { userId: 123, username: 'john.doe' };
    const token = generateToken(payload);

    // Send a response
    return res.status(200).json({ 'token': token });  
}



function importData(req, res) { 
    

/*     if (decodedToken > 0) {

        // Process the JSON data
        console.log('Received JSON data:', jsonData);
        processJSONData(jsonData);  
        msg = processQueue();  

        // Send a response
        res.status(200).json({ message: msg });

    } else {
        // Send a response
        res.status(498).json({ message: 'Invalid Token!'});
    }
*/
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

module.exports={ getToken, importData, search}