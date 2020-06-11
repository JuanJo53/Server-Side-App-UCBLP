import {Router} from 'express';
import { TokenValidation } from '../libs/VerifyToken';
import { recursoController } from '../controllers/RecursoController';

class RecursoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.post('/teacher/seccion',TokenValidation,recursoController.agregarSeccion);
       this.router.post('/teacher/seccion/resource',TokenValidation,recursoController.agregarRecurso);
       this.router.get('/teacher/seccion/resource/:id',recursoController.listarRecursos);
       this.router.delete('/teacher/seccion/resource/:id',recursoController.eliminarRecurso);
       this.router.delete('/teacher/seccion/:id',recursoController.eliminarSeccion);
       this.router.put('/teacher/seccion/:id',recursoController.modificarSeccion);
       this.router.put('/teacher/seccion/resource/:id',recursoController.modificarRecurso);
    }
}
const recursoRoutes=new RecursoRoutes();
export default recursoRoutes.router;
