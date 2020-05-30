import {Router} from 'express';
import{lessonController} from '../controllers/LessonController';
import { TokenValidation } from '../libs/VerifyToken';

class LessonsRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/modules/themes/lessons/:id',lessonController.listarLecciones);
        this.router.post('/teacher/modules/themes/lessons/:id',lessonController.agregarLeccion);
        this.router.put('/teacher/modules/themes/lessons/:id',lessonController.editarLeccion);
        this.router.delete('/teacher/modules/themes/:id');
    }
}
const lessonsRoutes=new LessonsRoutes();
export default lessonsRoutes.router;
