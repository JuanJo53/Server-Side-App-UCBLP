import {Router} from 'express';
import{lessonController} from '../../controllers/Docente_controllers/LessonController';
import { TokenValidation } from '../../libs/VerifyToken';

class LessonsRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/modules/themes/lessons/:id',TokenValidation,lessonController.listarLecciones);
        this.router.get('/teacher/modules/themes/lessons/get/tipo',TokenValidation,lessonController.listarTipoLeccion);
        this.router.post('/teacher/modules/themes/lessons/',TokenValidation,lessonController.agregarLeccion);
        this.router.put('/teacher/modules/themes/lessons/',TokenValidation,lessonController.editarLeccion);
        this.router.delete('/teacher/modules/themes/lessons/:id',TokenValidation,lessonController.eliminarLeccion);
    }
}
const lessonsRoutes=new LessonsRoutes();
export default lessonsRoutes.router;
