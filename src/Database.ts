import mysql from 'mysql'; 
import dotenv from 'dotenv';
dotenv.config();
import keys from './Keys';  

const pool=mysql.createPool({
    ...keys.database
});
pool.getConnection((err,connection)=>{
    console.log(keys);
    if(err) throw err;
    connection.release();
    console.log("Db is connected");
});
export default pool;
