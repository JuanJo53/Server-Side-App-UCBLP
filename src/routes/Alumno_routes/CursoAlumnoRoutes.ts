import {Router} from 'express';
import{cursoAlumnoController} from '../../controllers/Alumno_Controllers/CursoController';
import { TokenValidation } from '../../libs/VerifyToken';
import { TokenValidationAlumno } from '../../libs/VerifyTokenAlumno';

class CursoAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/students/courses',TokenValidationAlumno,cursoAlumnoController.listarCursos);
      
    }
}
const cursoAlumnoRoutes=new CursoAlumnoRoutes();
export default cursoAlumnoRoutes.router;
