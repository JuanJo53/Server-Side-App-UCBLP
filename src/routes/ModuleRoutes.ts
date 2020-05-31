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
        this.router.post('/teacher/modules',moduleController.agregarModuloPersonalizado);
        this.router.get('/teacher/modules',moduleController.listarModulos);
        this.router.put('/teacher/modules/personalized/:id',moduleController.editarModuloPersonalizado );
        this.router.put('/teacher/modules/predeterminated/:id',moduleController.editarModuloPredeterminado);
        this.router.put('/teacher/modules/disable/:id',moduleController.desactivarModulo);
        this.router.put('/teacher/modules/enable/:id',moduleController.activarModulo);
        this.router.delete('/teacher/modules/delete/:id',moduleController.eliminarModulo);
    }
}
const moduleRoutes=new ModuleRoutes();
export default moduleRoutes.router;
