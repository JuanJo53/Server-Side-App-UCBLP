import {Router} from 'express';
import{loginAlumnoController} from '../../controllers/Alumno_Controllers/LoginAlumnoController';
import { TokenValidationAlumno } from '../../libs/VerifyTokenAlumno';

class LoginAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    config():void{
      //  this.router.post('/students/login',loginController.validarDocente);
        this.router.put('/students/change/password/:id',loginAlumnoController.actucalizarContraseniaAlumno);
        this.router.post('/students/login',loginAlumnoController.validarAlumno);
        this.router.get('/students/profile',TokenValidationAlumno,loginAlumnoController.perfilAlumno);
    }
    
    
}
const loginAlumnoRoutes=new LoginAlumnoRoutes();
export default loginAlumnoRoutes.router;