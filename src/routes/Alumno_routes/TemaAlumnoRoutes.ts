import {Router} from 'express';
import{temaAlumnoController} from '../../controllers/Alumno_Controllers/TemaAlumnoController';
import { TokenValidation } from '../../libs/VerifyToken';

class TemaAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/student/themes/:id',TokenValidation,temaAlumnoController.listarTemas);
      
    }
}
const temaAlumnoRoutes=new TemaAlumnoRoutes();
export default temaAlumnoRoutes.router;
