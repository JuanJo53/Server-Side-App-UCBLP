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
       this.router.get('/teacher/seccion/:id',TokenValidation,recursoController.listarSecciones);
       this.router.get('/teacher/storagedoc',TokenValidation,recursoController.subirDoc);
       this.router.get('/teacher/storagevideo',TokenValidation,recursoController.subirVideo);
       this.router.get('/teacher/storageaudio',TokenValidation,recursoController.subirAudio);
       this.router.post('/teacher/resource/file',TokenValidation,recursoController.urlFile);
       this.router.get('/teacher/seccion/resource/:id',TokenValidation,recursoController.listarRecursos);
       this.router.delete('/teacher/seccion/resource/:id',TokenValidation,recursoController.eliminarRecurso);
       this.router.delete('/teacher/seccion/:id',TokenValidation,recursoController.eliminarSeccion);
       this.router.put('/teacher/seccion/',TokenValidation,recursoController.modificarSeccion);
       this.router.put('/teacher/seccion/resource',TokenValidation,recursoController.modificarRecurso);
    }
}
const recursoRoutes=new RecursoRoutes();
export default recursoRoutes.router;
