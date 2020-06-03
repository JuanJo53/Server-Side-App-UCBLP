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
        this.router.post('/teacher/forums',foroController.crearForo);
        this.router.get('/teacher/forums',foroController.listarForos);
        this.router.put('/teacher/forums/:id',foroController.modificarForos);
        this.router.delete('/teacher/forums',foroController.eliminarForo);
       
    }
}
const foroRoutes=new ForoRoutes();
export default foroRoutes.router;
