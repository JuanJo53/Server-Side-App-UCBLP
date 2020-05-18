import {Router} from 'express';
import{cursoController} from '../controllers/CursoController';
import { TokenValidation } from '../libs/VerifyToken';

class CursoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/class-room/',TokenValidation,cursoController.obtenerCursosDocente);
    }
}
const cursoRoutes=new CursoRoutes();
export default cursoRoutes.router;