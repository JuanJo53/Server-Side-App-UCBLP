"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../../libs/VerifyToken");
const DashBoardController_1 = require("../../controllers/Docente_controllers/DashBoardController");
class DashBoardRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/dash-board/practices/avg-qualifications', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.promedioPracticas);
        this.router.get('/teacher/dash-board/theme/practices/avg-qualification', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.promedioPracticasPorTema);
        this.router.get('/teacher/dash-board/theme/practices/qualification', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.notasPracticasPorTema);
        this.router.get('/teacher/dash-board/test/avg-qualifications', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.promedioExamenes);
        this.router.get('/teacher/dash-board/theme/test/avg-qualification', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.promedioExamenesPorTema);
        this.router.get('/teacher/dash-board/theme/test/qualification', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.notasExamenesPorTema);
        this.router.get('/teacher/dash-board/assistance', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.asistencia);
        this.router.get('/teacher/dash-board/non-assistance', VerifyToken_1.TokenValidation, DashBoardController_1.dashBoardController.faltas);
    }
}
const dashBoardRoutes = new DashBoardRoutes();
exports.default = dashBoardRoutes.router;
//# sourceMappingURL=DashBoardRoutes.js.map