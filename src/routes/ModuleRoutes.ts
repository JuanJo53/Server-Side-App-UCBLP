import {Router} from 'express';
import { TokenValidation } from '../libs/VerifyToken';
import { moduleController } from '../controllers/ModuleController';

class ModuleRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.post('/teacher/evaluation',TokenValidation,moduleController.agregarModuloPersonalizado);
        this.router.get('/teacher/evaluation/:id',TokenValidation,moduleController.listarModulos);
        this.router.get('/teacher/evaluation/get/color',TokenValidation,moduleController.listarColores);
        this.router.get('/teacher/evaluation/get/personalized/:id',moduleController.listarModulosPersonalizados);
        this.router.put('/teacher/evaluation/personalized',TokenValidation,moduleController.editarModuloPersonalizado );
        this.router.put('/teacher/evaluation/predeterminated',TokenValidation,moduleController.editarModuloPredeterminado);
        this.router.put('/teacher/evaluation/disable/:id',TokenValidation,moduleController.desactivarModulo);
        this.router.put('/teacher/evaluation/enable/:id',TokenValidation,moduleController.activarModulo);
        this.router.delete('/teacher/evaluation/delete/:id',TokenValidation,moduleController.eliminarModulo);
        this.router.post('/teacher/evaluation/rubric',TokenValidation,moduleController.actualizarRubricas);
    }
}
const moduleRoutes=new ModuleRoutes();
export default moduleRoutes.router;
