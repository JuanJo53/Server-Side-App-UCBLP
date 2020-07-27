import {Router} from 'express';
import { TokenValidation } from '../../libs/VerifyToken';
import { dashBoardController } from '../../controllers/Docente_controllers/DashBoardController';

class DashBoardRoutes{
    public router:Router=Router();;
    constructor(){
        this.config();

    }
    //configurar respuesta routas
    config():void{
        this.router.get('/teacher/dash-board/practices/avg-qualifications',TokenValidation,dashBoardController.promedioPracticas);
        this.router.get('/teacher/dash-board/theme/practices/avg-qualification',TokenValidation,dashBoardController.promedioPracticasPorTema);
        this.router.get('/teacher/dash-board/theme/practices/qualification',TokenValidation,dashBoardController.notasPracticasPorTema);
        this.router.get('/teacher/dash-board/test/avg-qualifications',TokenValidation,dashBoardController.promedioExamenes);
        this.router.get('/teacher/dash-board/theme/test/avg-qualification',TokenValidation,dashBoardController.promedioExamenesPorTema);
        this.router.get('/teacher/dash-board/theme/test/qualification',TokenValidation,dashBoardController.notasExamenesPorTema);
        this.router.get('/teacher/dash-board/assistance',TokenValidation,dashBoardController.asistencia);
        this.router.get('/teacher/dash-board/non-assistance',TokenValidation,dashBoardController.faltas);
    }
}
const dashBoardRoutes=new DashBoardRoutes();
export default dashBoardRoutes.router;
