import {Router} from 'express';
import{loginController} from '../controllers/LoginController';
class LoginRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/users/login',loginController.validarUsuario);
        this.router.post('/users/signup',loginController.registrarDocente);
        this.router.get('/users',loginController.listarDocentes);
        this.router.delete('/users/:id',loginController.eliminarDocente);
    }
}
const loginroutes=new LoginRoutes();
export default loginroutes.router;