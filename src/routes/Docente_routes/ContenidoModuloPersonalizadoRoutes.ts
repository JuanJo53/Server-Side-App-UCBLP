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
        this.router.post('/teacher/cutson/module/content/get',contenidoModuloPersonalizadoController.listarContenido);
        this.router.post('/teacher/cutson/module/content',contenidoModuloPersonalizadoController.agregarContenido);
        this.router.post('/teacher/cutson/module/content/rubric',contenidoModuloPersonalizadoController.actualizarRubricas);
        this.router.put('/teacher/cutson/module/content',contenidoModuloPersonalizadoController.modificarContenido);
        this.router.delete('/teacher/cutson/module/content/:id',contenidoModuloPersonalizadoController.eliminarContenido);
        this.router.put('/teacher/cutson/module/content/enable/:id',contenidoModuloPersonalizadoController.activarContenido);
        this.router.put('/teacher/cutson/module/content/disable/:id',contenidoModuloPersonalizadoController.desactivarContenido);
        this.router.get('/teacher/cutson/module/content/score/get/:id',contenidoModuloPersonalizadoController.listarNotasContenido);
        this.router.put('/teacher/cutson/module/content/score/',TokenValidation,contenidoModuloPersonalizadoController.modificarNotaContenido);
    }
}
const contenidoModuloPersonalizadoRoutes=new ContenidoModuloPersonalizadoRoutes();
export default contenidoModuloPersonalizadoRoutes.router;