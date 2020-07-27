import {Router} from 'express';
import{cursoController} from '../../controllers/Docente_controllers/CursoController';
import { TokenValidation } from '../../libs/VerifyToken';

class CursoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/class-room',TokenValidation,cursoController.obtenerCursosDocente);
        this.router.get('/teacher/class-room/semester',TokenValidation,cursoController.obtenerSemestres);
        this.router.get('/teacher/class-room/level',TokenValidation,cursoController.obtenerNiveles);
        this.router.get('/teacher/class-room/navigation-tab',TokenValidation,cursoController.obtenerCursosDocentePestania);
        this.router.post('/teacher/class-room',TokenValidation,cursoController.agregarCurso);
        this.router.get('/teacher/class-room/schedule',TokenValidation,cursoController.obtenerHorariodeCurso);
        this.router.post('/teacher/class-room/add/schedule',TokenValidation,cursoController.agregarHorarioACurso);
        this.router.delete('/teacher/class-room/delete/day/schedule/:id',TokenValidation,cursoController.eliminarDiaDeHorario);
        this.router.put('/teacher/class-room/modify/day/schedule',TokenValidation,cursoController.modificarDiaDeHorario); 


    }
}
const cursoRoutes=new CursoRoutes();
export default cursoRoutes.router;
