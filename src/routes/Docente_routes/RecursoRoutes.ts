import {Router} from 'express';
import { TokenValidation } from '../../libs/VerifyToken';
import { recursoController } from '../../controllers/Docente_controllers/RecursoController';

class RecursoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.post('/teacher/seccion',TokenValidation,recursoController.agregarSeccion);
       this.router.post('/teacher/seccion/resource',TokenValidation,recursoController.agregarRecurso);
       this.router.get('/teacher/seccion/:id',recursoController.listarSecciones);
       this.router.get('/teacher/storagedoc',recursoController.subirDoc);
       this.router.get('/teacher/storagevideo',recursoController.subirVideo);
       this.router.get('/teacher/storageaudio',recursoController.subirAudio);
       this.router.post('/teacher/resource/file',recursoController.urlFile);
       this.router.get('/teacher/seccion/resource/:id',recursoController.listarRecursos);
       this.router.delete('/teacher/seccion/resource/:id',recursoController.eliminarRecurso);
       this.router.delete('/teacher/seccion/:id',recursoController.eliminarSeccion);
       this.router.put('/teacher/seccion/',recursoController.modificarSeccion);
       this.router.put('/teacher/seccion/resource',recursoController.modificarRecurso);
    }
}
const recursoRoutes=new RecursoRoutes();
export default recursoRoutes.router;
