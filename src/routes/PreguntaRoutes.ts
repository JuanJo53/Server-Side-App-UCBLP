import {Router} from 'express';
import { TokenValidation } from '../libs/VerifyToken';
import { preguntaController } from '../controllers/PreguntaController';

class PreguntaRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/question/type_of_question',preguntaController.listarTipoPregunta);
        this.router.get('/teacher/question/type_of_answer',preguntaController.listarTipoRespuesta);
        this.router.post('/teacher/question',preguntaController.agregarPregunta);
        this.router.get('/teacher/question',preguntaController.listarPreguntas);
    }
    
}
const preguntaRoutes=new PreguntaRoutes();
export default preguntaRoutes.router;
