import {Router} from 'express';
import{temaAlumnoController} from '../../controllers/Alumno_Controllers/TemaAlumnoController';
import { TokenValidationAlumno } from '../../libs/VerifyTokenAlumno';

class TemaAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/students/themes/:id',TokenValidationAlumno,temaAlumnoController.listarTemas);
      
    }
}
const temaAlumnoRoutes=new TemaAlumnoRoutes();
export default temaAlumnoRoutes.router;
