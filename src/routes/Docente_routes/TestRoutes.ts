import {Router} from 'express';
import { TokenValidation } from '../../libs/VerifyToken';
import { testController } from '../../controllers/Docente_controllers/TestController';

class TestRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/test/:id',TokenValidation,testController.listarExamenes);
        this.router.post('/teacher/test',TokenValidation,testController.agregarExamen);
        this.router.put('/teacher/test',TokenValidation,testController.modificarExamen);
        this.router.delete('/teacher/test/:id',TokenValidation,testController.eliminarExamen);
        this.router.get('/teacher/test/questions/:id',TokenValidation,testController.listarPreguntasExamen);
        this.router.post('/teacher/test/questions',TokenValidation,testController.agregarPreguntasExamen);
        this.router.put('/teacher/test/questions',TokenValidation,testController.modificarPreguntaExamen);
        this.router.delete('/teacher/test/questions/:id',TokenValidation,testController.eliminarPreguntaExamen);
    }
}
const testRoutes=new TestRoutes();
export default testRoutes.router;
