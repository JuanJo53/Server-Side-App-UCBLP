import fs from 'fs';
var ca=fs.readFileSync(__dirname+'/certs/server-ca.pem')
var cert=fs.readFileSync(__dirname+'/certs/client-cert.pem')
var key=fs.readFileSync(__dirname+'/certs/client-key.pem')
export default{
    database:{      
        host: '34.95.189.118',
        user:"admin_ucb_plat",
        password:"BaseDeDatosIdiomas-UCB",
        database:"plataforma_idiomas" ,
        ssl:{   
            ca:ca,
            cert:cert,
            key: key
        }
    },
    /*database:{      
        socketPath: '/cloudsql/grand-citadel-275922:southamerica-east1:db-ucb-idiomas',
        user:"admin_ucb_plat",
        password:"BaseDeDatosIdiomas-UCB",
        database:"plataforma_idiomas" 
    }*/
}  