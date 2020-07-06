import {Router} from 'express';
import { TokenValidation } from '../libs/VerifyToken';
import { testController } from '../controllers/TestController';

class TestRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/test/:id',testController.listarExamenes);
        this.router.post('/teacher/test',testController.agregarExamen);
        this.router.put('/teacher/test',testController.modificarExamen);
        this.router.delete('/teacher/test/:id',testController.eliminarExamen);
        this.router.get('/teacher/test/questions/:id',testController.listarPreguntasExamen);
        this.router.post('/teacher/test/questions',testController.agregarPreguntasExamen);
        this.router.put('/teacher/test/questions',testController.modificarPreguntaExamen);
        this.router.delete('/teacher/test/questions/:id',testController.eliminarPreguntaExamen);
    }
}
const testRoutes=new TestRoutes();
export default testRoutes.router;
