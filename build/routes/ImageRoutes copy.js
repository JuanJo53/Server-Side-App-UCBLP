"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashBoardController_1 = require("../controllers/DashBoardController");
class DashBoardRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/dash-board/practices/avg-qualifications', DashBoardController_1.dashBoardController.promedioPracticas);
        this.router.get('/teacher/dash-board/theme/practices/avg-qualification', DashBoardController_1.dashBoardController.promedioPracticasPorTema);
        this.router.get('/teacher/dash-board/theme/practices/qualification', DashBoardController_1.dashBoardController.notasPracticasPorTema);
        this.router.get('/teacher/dash-board/test/avg-qualifications', DashBoardController_1.dashBoardController.promedioExamenes);
        this.router.get('/teacher/dash-board/theme/test/avg-qualification', DashBoardController_1.dashBoardController.promedioExamenesPorTema);
        this.router.get('/teacher/dash-board/theme/test/qualification', DashBoardController_1.dashBoardController.notasExamenesPorTema);
        this.router.get('/teacher/dash-board/assistance', DashBoardController_1.dashBoardController.asistencia);
    }
}
const dashBoardRoutes = new DashBoardRoutes();
exports.default = dashBoardRoutes.router;
//# sourceMappingURL=ImageRoutes copy.js.map