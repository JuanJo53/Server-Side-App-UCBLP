import {Router} from 'express';
import { TokenValidation } from '../../libs/VerifyToken';
import { practicaController } from '../../controllers/Docente_controllers/PracticaController';

class PracticaRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/practice/:id',TokenValidation,practicaController.listarPracticas);
        this.router.post('/teacher/practice',TokenValidation,practicaController.agregarPractica);
        this.router.put('/teacher/practice',TokenValidation,practicaController.modificarPractica);
        this.router.delete('/teacher/practice/:id',TokenValidation,practicaController.eliminarPractica);
        this.router.get('/teacher/practice/questions/:id',TokenValidation,practicaController.listarPreguntasPractica);
        this.router.get('/teacher/practice/mod/:id',TokenValidation,practicaController.obtenerPractica);
        this.router.post('/teacher/practice/questions',TokenValidation,practicaController.agregarPreguntasPractica);
        // this.router.post('/teacher/practice/questionsSQL',practicaController.agregarPreguntasPracticaSQL);
        this.router.put('/teacher/practice/questions',TokenValidation,practicaController.modificarPreguntaPractica);
        this.router.delete('/teacher/practice/questions/:id',TokenValidation,practicaController.eliminarPreguntaPractica);
        this.router.get('/teacher/practice/scores/:id',TokenValidation,practicaController.listarNotasPractica);
        this.router.get('/teacher/practice/scores/individual/:id',TokenValidation,practicaController.respuestasEstudiante);
        this.router.get('/teacher/dataset',TokenValidation,practicaController.dataSetPractica);
    }
}
const practicaRoutes=new PracticaRoutes();
export default practicaRoutes.router;
