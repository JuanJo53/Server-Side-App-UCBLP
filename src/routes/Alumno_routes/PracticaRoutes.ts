import {Router} from 'express';
import{loginAlumnoController} from '../../controllers/Alumno_Controllers/LoginAlumnoController';
import { TokenValidation } from '../../libs/VerifyToken';
import { practicaController } from '../../controllers/Alumno_Controllers/PracticaController';
import { TokenValidationAlumno } from '../../libs/VerifyTokenAlumno';
import { TokenValidationTest } from '../../libs/VerifyTokenTest';

class PracticaAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    config():void{
      this.router.get('/students/practices/:id',TokenValidationAlumno,practicaController.listarPracticas);
      this.router.get('/students/info/practices/:id',TokenValidationAlumno,practicaController.infoPractica);
      this.router.get('/students/practice/start/:id',TokenValidationAlumno,practicaController.obtenerPractica);
      this.router.get('/students/practiceSQL/start/:id',TokenValidationAlumno,practicaController.obtenerTokenPractica);
      this.router.get('/students/practiceSQL/questions',TokenValidationAlumno,TokenValidationTest,practicaController.obtenerPracticaSQL);
      this.router.post('/students/practice/finish',TokenValidationAlumno,TokenValidationTest,practicaController.revisarPracticaSQL);
      // this.router.post('/students/practice/finish',TokenValidationAlumno,practicaController.revisarPractica);
    }
    
    
}
const practicaAlumnoRoutes=new PracticaAlumnoRoutes();
export default practicaAlumnoRoutes.router;