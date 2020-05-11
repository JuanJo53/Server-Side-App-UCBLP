import {Router} from 'express';
import{loginController} from '../controllers/LoginController';
class LoginRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/users/login',loginController.login);
        this.router.get('/users',loginController.listarDocentes);
    }
}
const loginroutes=new LoginRoutes();
export default loginroutes.router;