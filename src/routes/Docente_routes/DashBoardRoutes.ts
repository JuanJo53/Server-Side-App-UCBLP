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
        this.router.get('/teacher/dash-board/practices/avg-qualifications',dashBoardController.promedioPracticas);
        this.router.get('/teacher/dash-board/theme/practices/avg-qualification',dashBoardController.promedioPracticasPorTema);
        this.router.get('/teacher/dash-board/theme/practices/qualification',dashBoardController.notasPracticasPorTema);
        this.router.get('/teacher/dash-board/test/avg-qualifications',dashBoardController.promedioExamenes);
        this.router.get('/teacher/dash-board/theme/test/avg-qualification',dashBoardController.promedioExamenesPorTema);
        this.router.get('/teacher/dash-board/theme/test/qualification',dashBoardController.notasExamenesPorTema);
        this.router.get('/teacher/dash-board/assistance',dashBoardController.asistencia);
        this.router.get('/teacher/dash-board/non-assistance',dashBoardController.faltas);
    }
}
const dashBoardRoutes=new DashBoardRoutes();
export default dashBoardRoutes.router;
