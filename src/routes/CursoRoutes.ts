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
        this.router.get('/teacher/class-room',TokenValidation,cursoController.obtenerCursosDocente);
        this.router.get('/teacher/class-room/navigation-tab',TokenValidation,cursoController.obtenerCursosDocentePestania);
        this.router.post('/teacher/class-room',cursoController.agregarCurso);
    }
}
const cursoRoutes=new CursoRoutes();
export default cursoRoutes.router;
