import {Router} from 'express';
import { TokenValidation } from '../libs/VerifyToken';
import { foroController } from '../controllers/ForoController';

class ForoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.post('/teacher/forums',TokenValidation,foroController.crearForo);
        this.router.get('/teacher/forums',TokenValidation,foroController.listarForos);
        this.router.put('/teacher/forums/:id',TokenValidation,foroController.modificarForos);
        this.router.delete('/teacher/forums',TokenValidation,foroController.eliminarForo);
       
    }
}
const foroRoutes=new ForoRoutes();
export default foroRoutes.router;
