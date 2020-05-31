import express, { Application } from 'express';
import dotenv from 'dotenv';
import LoginRoutes from './routes/LoginRoutes';
import CursoRoutes from './routes/CursoRoutes';
import ClassRoutes from './routes/ClassRoutes';
import ThemeRoutes from './routes/ThemeRoutes';
import ImageRoutes from './routes/ImageRoutes';
import LessonRoutes from './routes/LessonRoutes';
import ModuleRoutes from './routes/ModuleRoutes';
import morgan from 'morgan';
import cors from 'cors';
dotenv.config();
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
        this.app.use(CursoRoutes);
        this.app.use(ClassRoutes);
        this.app.use(ThemeRoutes);
        this.app.use(ImageRoutes);
        this.app.use(LessonRoutes);
        this.app.use(ModuleRoutes);
    }
    start():void{
        this.app.listen(this.app.get('port'));
        console.log("Server o port",this.app.get('port'));

    }
    
    
}
const server=new Server();
server.start();