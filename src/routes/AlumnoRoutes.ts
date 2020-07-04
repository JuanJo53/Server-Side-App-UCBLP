import {Router} from 'express';
import{alumnoController} from '../controllers/AlumnoController';
import { TokenValidation } from '../libs/VerifyToken';

class AlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/student/profile',TokenValidation,alumnoController.obtenerPerfilAlumno);
        this.router.get('/student/qualifications',TokenValidation,alumnoController.obtenerCalificacionesAlumnoModulo);
    }
}
const alumnoRoutes=new AlumnoRoutes();
export default alumnoRoutes.router;
