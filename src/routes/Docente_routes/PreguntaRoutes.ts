import {Router} from 'express';
import { TokenValidation } from '../../libs/VerifyToken';
import { preguntaController } from '../../controllers/Docente_controllers/PreguntaController';

class PreguntaRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/question/type_of_question',TokenValidation,preguntaController.listarTipoPregunta);
        this.router.get('/teacher/question/type_of_answer',TokenValidation,preguntaController.listarTipoRespuesta);
        this.router.post('/teacher/question',TokenValidation,preguntaController.agregarPregunta);
        this.router.get('/teacher/question',TokenValidation,preguntaController.listarPreguntas2);
    }
    
}
const preguntaRoutes=new PreguntaRoutes();
export default preguntaRoutes.router;
