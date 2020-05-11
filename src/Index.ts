import express, { Application } from 'express';
import LoginRoutes from './routes/LoginRoutes';
import morgan from 'morgan';
import cors from 'cors';
class Server{

    public app:Application;
    constructor(){
        this.app=express();
        this.config();
        this.routes();
    }
    //configurar modulos
    config():void{
        this.app.set('port',process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));

    }
    //configurar rutas
    routes():void{
        this.app.use(LoginRoutes);
    }
    start():void{
        this.app.listen(this.app.get('port'));
        console.log("Server o port",this.app.get('port'));

    }
    
    
}
const server=new Server();
server.start();