import {Router} from 'express';
import{loginAlumnoController} from '../../controllers/Alumno_Controllers/LoginAlumnoController';
import { TokenValidation } from '../../libs/VerifyToken';
import { practicaController } from '../../controllers/Alumno_Controllers/PracticaController';

class PracticaAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    config():void{
      this.router.get('/students/practica/:id',practicaController.obtenerPractica);
    }
    
    
}
const practicaAlumnoRoutes=new PracticaAlumnoRoutes();
export default practicaAlumnoRoutes.router;