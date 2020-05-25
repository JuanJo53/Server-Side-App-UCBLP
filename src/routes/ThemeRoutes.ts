import {Router} from 'express';
import{themeController} from '../controllers/ThemeController';
import { TokenValidation } from '../libs/VerifyToken';

class ThemeRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/class-room',);
        this.router.get('/teacher/class-room/prueba',);
    }
}
const themeRoutes=new ThemeRoutes();
export default themeRoutes.router;
