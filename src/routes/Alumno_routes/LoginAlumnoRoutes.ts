import {Router} from 'express';
import{loginAlumnoController} from '../../controllers/Alumno_Controllers/LoginAlumnoController';
import { TokenValidation } from '../../libs/VerifyToken';

class LoginAlumnoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    config():void{
      //  this.router.post('/students/login',loginController.validarDocente);
        this.router.put('/students/change/password/:id',loginAlumnoController.actucalizarContraseniaAlumno);
    }
    
    
}
const loginAlumnoRoutes=new LoginAlumnoRoutes();
export default loginAlumnoRoutes.router;