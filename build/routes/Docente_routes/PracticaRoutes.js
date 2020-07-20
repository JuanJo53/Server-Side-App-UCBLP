"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PracticaController_1 = require("../../controllers/Docente_controllers/PracticaController");
class PracticaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/practice/:id', PracticaController_1.practicaController.listarPracticas);
        this.router.post('/teacher/practice', PracticaController_1.practicaController.agregarPractica);
        this.router.put('/teacher/practice', PracticaController_1.practicaController.modificarPractica);
        this.router.delete('/teacher/practice/:id', PracticaController_1.practicaController.eliminarPractica);
        this.router.get('/teacher/practice/questions/:id', PracticaController_1.practicaController.listarPreguntasPractica);
        this.router.post('/teacher/practice/questions', PracticaController_1.practicaController.agregarPreguntasPractica);
        this.router.put('/teacher/practice/questions', PracticaController_1.practicaController.modificarPreguntaPractica);
        this.router.delete('/teacher/practice/questions/:id', PracticaController_1.practicaController.eliminarPreguntaPractica);
    }
}
const practicaRoutes = new PracticaRoutes();
exports.default = practicaRoutes.router;
//# sourceMappingURL=PracticaRoutes.js.map