import {Router} from 'express';
import{leccionAlumnoController} from '../../controllers/Alumno_Controllers/LeccionAlumnoController';
import { TokenValidationAlumno } from '../../libs/VerifyTokenAlumno';

class TemaAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/students/lessons/:id',TokenValidationAlumno,leccionAlumnoController.listarLecciones);
      
    }
}
const temaAlumnoRoutes=new TemaAlumnoRoutes();
export default temaAlumnoRoutes.router;
