import express, { Application } from 'express';
import LoginRoutes from './routes/Docente_routes/LoginRoutes';
import CursoRoutes from './routes/Docente_routes/CursoRoutes';
import ClassRoutes from './routes/Docente_routes/ClassRoutes';
import ThemeRoutes from './routes/Docente_routes/ThemeRoutes';
import ImageRoutes from './routes/Docente_routes/ImageRoutes';
import LessonRoutes from './routes/Docente_routes/LessonRoutes';
import ModuleRoutes from './routes/Docente_routes/ModuleRoutes';
import ForoRoutes from './routes/Docente_routes/ForoRoutes';
import RecursoRoutes from './routes/Docente_routes/RecursoRoutes';
import PreguntaRoutes from './routes/Docente_routes/PreguntaRoutes';
import TestRoutes from './routes/Docente_routes/TestRoutes';
import PracticaRoutes from './routes/Docente_routes/PracticaRoutes';
import AlumnoRoutes from './routes/Docente_routes/AlumnoRoutes';
import DashBoardRoutes from './routes/Docente_routes/DashBoardRoutes';
import ContenidoModuloPersonalizadoRoutes from './routes/Docente_routes/ContenidoModuloPersonalizadoRoutes';
import LoginAlumnoRoutes from './routes/Alumno_routes/LoginAlumnoRoutes';
import PracticaAlumnoRoutes from './routes/Alumno_routes/PracticaRoutes';
import TemaAlumnoRoutes from './routes/Alumno_routes/TemaAlumnoRoutes';
import LeccionAlumnoRoutes from './routes/Alumno_routes/LeccionAlumnoRoutes';
import CursoAlumnoRoutes from './routes/Alumno_routes/CursoAlumnoRoutes';
import RecursoAlumnoRoutes from './routes/Alumno_routes/RecursoAlumnoRoutes';
import ModuloAlumnoRoutes from './routes/Alumno_routes/ModuloAlumnoRoutes';
import morgan from 'morgan';
import cors from 'cors';
import { ConFirebase } from './FIrebase';
class Server{ 


    public app:Application;
    
    constructor(){
        this.app=express();
        this.config();
        this.docenteRoutes();
        this.alumnoRoutes();
    }
    //configurar modulos
    config():void{
        let newCon=new ConFirebase();
        newCon.iniciar();
        this.app.set('port',process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));

    }
    //configurar rutas
    docenteRoutes():void{
        this.app.use(LoginRoutes);
        this.app.use(CursoRoutes);
        this.app.use(ClassRoutes);
        this.app.use(ThemeRoutes);
        this.app.use(ImageRoutes);
        this.app.use(LessonRoutes);
        this.app.use(ModuleRoutes);
        this.app.use(ForoRoutes);
        this.app.use(RecursoRoutes);
        this.app.use(PreguntaRoutes);
        this.app.use(TestRoutes);
        this.app.use(PracticaRoutes);
        this.app.use(AlumnoRoutes);
        this.app.use(DashBoardRoutes);
        this.app.use(ContenidoModuloPersonalizadoRoutes);
        this.app.use(RecursoAlumnoRoutes);
        this.app.use(ModuloAlumnoRoutes);
    }
    alumnoRoutes():void{
        this.app.use(LoginAlumnoRoutes);
        this.app.use(PracticaAlumnoRoutes);
        this.app.use(TemaAlumnoRoutes);
        this.app.use(LeccionAlumnoRoutes);
        this.app.use(CursoAlumnoRoutes);
    }
    start():void{
        this.app.listen(this.app.get('port'));
        console.log("Server o port",this.app.get('port'));

    }


    
    
}
const server=new Server();
server.start();