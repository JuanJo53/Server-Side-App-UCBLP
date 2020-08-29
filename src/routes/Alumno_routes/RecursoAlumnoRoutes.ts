import {Router} from 'express';
import { TokenValidationAlumno } from '../../libs/VerifyTokenAlumno';
import { recursoAlumnoController } from '../../controllers/Alumno_Controllers/RecursoAlumnoController';

class RecursoAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/students/courses/resources/:id',TokenValidationAlumno,recursoAlumnoController.obtenerRecursosAlumno);
        this.router.post('/students/resource/file',TokenValidationAlumno,recursoAlumnoController.urlFile);
      
    }
}
const recursoAlumnoRoutes=new RecursoAlumnoRoutes();
export default recursoAlumnoRoutes.router;
