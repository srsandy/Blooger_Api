const express = require('express');
const path = require('path');



//Express app setup
const PORT = 3000 || process.env.port;
const app = express();



//Start the server
app.listen(PORT, err =>{
  if(err) throw err;
  open('http://localhost:' + PORT+ '/login');
});
