import mysql from 'mysql'; 
import dotenv from 'dotenv';
dotenv.config();
import keys from './Keys';  

const pool=mysql.createConnection({
    ...keys.database,multipleStatements:true

});
pool.config
pool.connect((err,connection)=>{
    console.log(keys);
    if(err) throw err;
    console.log(connection);
    console.log("Db is connected");
});

export default pool;
