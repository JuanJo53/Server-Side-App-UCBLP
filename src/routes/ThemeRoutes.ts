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
        this.router.get('/teacher/class-room/themes',themeController.listarTemas);
        this.router.post('/teacher/class-room/themes',themeController.agregarTema);
        this.router.put('/teacher/class-room/themes/:id',themeController.actualizarTema);
        this.router.delete('/teacher/class-room/themes/:id',themeController.eliminarTema);
    }
}
const themeRoutes=new ThemeRoutes();
export default themeRoutes.router;
