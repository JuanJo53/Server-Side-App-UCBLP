import {Router} from 'express';
import { TokenValidation } from '../../libs/VerifyToken';
import { imageController } from '../../controllers/Docente_controllers/ImageController';

class ImageRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/images/get',TokenValidation,imageController.listarImagenes );
    }
}
const imageRoutes=new ImageRoutes();
export default imageRoutes.router;
