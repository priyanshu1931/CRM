import 'dotenv/config'

import app from './index.js';

import connect from './database/db.js';
connect();

app.listen(process.env.PORT, (req,res) =>{
    console.log(`server listening on ${process.env.PORT}`)
})