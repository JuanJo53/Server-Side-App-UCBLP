import {Router} from 'express';
import{classController} from '../controllers/ClassController';
import { TokenValidation } from '../libs/VerifyToken';
import { cursoController } from 'controllers/CursoController';

class ClassRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        //this.router.get('/teacher/class-room',TokenValidation,cursoController.obtenerCursosDocente);
        this.router.get('/teacher/my-class/students/:id',classController.listaAlumnos);
        this.router.delete('/teacher/my-class/students/:id',classController.bajaAlumno);
        
    }
}
const classRoutes=new ClassRoutes();
export default classRoutes.router;
