import {Router} from 'express';
import{leccionAlumnoController} from '../../controllers/Alumno_Controllers/LeccionAlumnoController';
import { TokenValidation } from '../../libs/VerifyToken';

class TemaAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/student/themes/lessons/:id',TokenValidation,leccionAlumnoController.listarLecciones);
      
    }
}
const temaAlumnoRoutes=new TemaAlumnoRoutes();
export default temaAlumnoRoutes.router;
