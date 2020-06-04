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
        this.router.post('/teacher/evaluation',moduleController.agregarModuloPersonalizado);
        this.router.get('/teacher/evaluation/:id',moduleController.listarModulos);
        this.router.get('/teacher/evaluation/get/color',moduleController.listarColores);
        this.router.put('/teacher/evaluation/personalized/',moduleController.editarModuloPersonalizado );
        this.router.put('/teacher/evaluation/predeterminated/',moduleController.editarModuloPredeterminado);
        this.router.put('/teacher/evaluation/disable/:id',moduleController.desactivarModulo);
        this.router.put('/teacher/evaluation/enable/:id',moduleController.activarModulo);
        this.router.delete('/teacher/evaluation/delete/:id',moduleController.eliminarModulo);
    }
}
const moduleRoutes=new ModuleRoutes();
export default moduleRoutes.router;
