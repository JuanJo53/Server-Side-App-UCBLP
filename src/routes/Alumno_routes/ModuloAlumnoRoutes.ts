import {Router} from 'express';
import { TokenValidationAlumno } from '../../libs/VerifyTokenAlumno';
import { moduloAlumnoController } from '../../controllers/Alumno_Controllers/ModuloAlumnoController';

class ModuloAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
       this.router.get('/students/courses/modules/:id',TokenValidationAlumno,moduloAlumnoController.listarNombreModulos);
       this.router.get('/students/courses/modules/notes/:id',TokenValidationAlumno,moduloAlumnoController.listarNotasModulos);
       this.router.get('/students/courses/modules/custom/:id',TokenValidationAlumno,moduloAlumnoController.modulosPersonalizadosSimple);
       this.router.get('/students/courses/modules/custom/score/:id',TokenValidationAlumno,moduloAlumnoController.scoreModuloPersonalizado);
      
    }
}
const moduloAlumnoRoutes=new ModuloAlumnoRoutes();
export default moduloAlumnoRoutes.router;
