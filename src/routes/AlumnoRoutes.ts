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
        this.router.get('/student/qualifications/modules',alumnoController.obtenerCalificacionesAlumnoModulo);
        this.router.get('/student/qualification/avg/practices',alumnoController.obtenerPromedioAlumnoPracticas);
        this.router.put('/student/qualification/practices/uptade',alumnoController.actualizarNotaModuloPracticas);
    }
}
const alumnoRoutes=new AlumnoRoutes();
export default alumnoRoutes.router;
