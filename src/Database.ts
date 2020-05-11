import mysql from 'mysql';
import keys from './Keys';  

const pool=mysql.createPool(keys.database);
pool.getConnection((err,connection)=>{
    if(err) throw err;
    connection.release();
    console.log("Db is connected");
});
export default pool;
