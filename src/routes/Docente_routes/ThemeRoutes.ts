import {Router} from 'express';
import{themeController} from '../../controllers/Docente_controllers/ThemeController';
import { TokenValidation } from '../../libs/VerifyToken';

class ThemeRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/modules/themes/:id',TokenValidation,themeController.listarTemas);
        this.router.post('/teacher/modules/themes',TokenValidation,themeController.agregarTema);
        this.router.put('/teacher/modules/themes/',TokenValidation,themeController.actualizarTema);
        this.router.delete('/teacher/modules/themes/:id',TokenValidation,themeController.eliminarTema);
    }
}
const themeRoutes=new ThemeRoutes();
export default themeRoutes.router;
