import {Router} from 'express';
import { TokenValidation } from '../libs/VerifyToken';
import { practicaController } from '../controllers/PracticaController';

class PracticaRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/practice/:id',practicaController.listarPracticas);
        this.router.post('/teacher/practice',practicaController.agregarPractica);
        this.router.put('/teacher/practice',practicaController.modificarPractica);
        this.router.delete('/teacher/practice/:id',practicaController.eliminarPractica);
        this.router.get('/teacher/practice/questions/:id',practicaController.listarPreguntasPractica);
        this.router.post('/teacher/practice/questions',practicaController.agregarPreguntasPractica);
        this.router.put('/teacher/practice/questions',practicaController.modificarPreguntaPractica);
        this.router.delete('/teacher/practice/questions/:id',practicaController.eliminarPreguntaPractica);
    }
}
const practicaRoutes=new PracticaRoutes();
export default practicaRoutes.router;
