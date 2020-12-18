import {Router} from 'express';
import { TokenValidation } from '../../libs/VerifyToken';
import { contenidoModuloPersonalizadoController } from '../../controllers/Docente_controllers/ContenidoModuloPersonalizadoController';

class ContenidoModuloPersonalizadoRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/cutson/module/content/:id',TokenValidation,contenidoModuloPersonalizadoController.listarContenido);
        this.router.post('/teacher/cutson/module/content',TokenValidation,contenidoModuloPersonalizadoController.agregarContenido);
        this.router.post('/teacher/cutson/module/content/rubric',TokenValidation,contenidoModuloPersonalizadoController.actualizarRubricas);
        this.router.put('/teacher/cutson/module/content',TokenValidation,contenidoModuloPersonalizadoController.modificarContenido);
        // this.router.delete('/teacher/cutson/module/content/:id',TokenValidation,contenidoModuloPersonalizadoController.eliminarContenido);
        this.router.post('/teacher/cutson/module/deleteContent/:id',TokenValidation,contenidoModuloPersonalizadoController.eliminarContenido);
        this.router.put('/teacher/cutson/module/content/enable/:id',TokenValidation,contenidoModuloPersonalizadoController.activarContenido);
        this.router.put('/teacher/cutson/module/content/disable/:id',TokenValidation,contenidoModuloPersonalizadoController.desactivarContenido);
        this.router.get('/teacher/cutson/module/content/score/get/:id',TokenValidation,contenidoModuloPersonalizadoController.listarNotasContenido);
        this.router.put('/teacher/cutson/module/content/score/',TokenValidation,contenidoModuloPersonalizadoController.modificarNotaContenido);
    }
}
const contenidoModuloPersonalizadoRoutes=new ContenidoModuloPersonalizadoRoutes();
export default contenidoModuloPersonalizadoRoutes.router;