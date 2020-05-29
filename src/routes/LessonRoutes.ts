import {Router} from 'express';
//import{themeController} from '../controllers/ThemeController';
import { TokenValidation } from '../libs/VerifyToken';

class LessonsRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/modules/themes/:id');
        this.router.post('/teacher/modules/themes');
        this.router.put('/teacher/modules/themes/');
        this.router.delete('/teacher/modules/themes/:id');
    }
}
const lessonsRoutes=new LessonsRoutes();
export default lessonsRoutes.router;
