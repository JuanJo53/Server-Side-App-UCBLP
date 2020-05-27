import {Router} from 'express';
import{themeController} from '../controllers/ThemeController';
import { TokenValidation } from '../libs/VerifyToken';
import { imageController } from '../controllers/ImageController';

class ImageRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/class-room/themes/images',TokenValidation,imageController.listarImagenes );
    }
}
const imageRoutes=new ImageRoutes();
export default imageRoutes.router;
