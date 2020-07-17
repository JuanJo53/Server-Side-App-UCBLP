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
        this.router.get('/teacher/class-room/schedule',cursoController.obtenerHorariodeCurso);
        this.router.post('/teacher/class-room/add/schedule',cursoController.agregarHorarioACurso);
        this.router.delete('/teacher/class-room/delete/day/schedule/:id',cursoController.eliminarDiaDeHorario);
        this.router.put('/teacher/class-room/modify/day/schedule',cursoController.modificarDiaDeHorario);


    }
}
const cursoRoutes=new CursoRoutes();
export default cursoRoutes.router;
