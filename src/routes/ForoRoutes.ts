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
        this.router.get('/teacher/forums/:id',TokenValidation,foroController.listarForos);
        this.router.put('/teacher/forums/',TokenValidation,foroController.modificarForos);
        this.router.delete('/teacher/forums',TokenValidation,foroController.eliminarForo);
        this.router.post('/teacher/forums/message',foroController.agregarMensaje);
       
    }
}
const foroRoutes=new ForoRoutes();
export default foroRoutes.router;
