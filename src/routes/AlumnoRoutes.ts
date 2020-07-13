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
        this.router.post('/student/profile',TokenValidation,alumnoController.obtenerPerfilAlumno);
        this.router.get('/student/qualifications/modules',TokenValidation,alumnoController.obtenerCalificacionesAlumnoModulo);
        this.router.get('/student/qualification/avg/practices',TokenValidation,alumnoController.obtenerPromedioAlumnoPracticas);
        this.router.put('/student/qualification/practices/uptade',TokenValidation,alumnoController.actualizarNotaModuloPracticas);
    }
}
const alumnoRoutes=new AlumnoRoutes();
export default alumnoRoutes.router;
