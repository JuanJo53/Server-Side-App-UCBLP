"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TestController_1 = require("../../controllers/Docente_controllers/TestController");
class TestRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/test/:id', TestController_1.testController.listarExamenes);
        this.router.post('/teacher/test', TestController_1.testController.agregarExamen);
        this.router.put('/teacher/test', TestController_1.testController.modificarExamen);
        this.router.delete('/teacher/test/:id', TestController_1.testController.eliminarExamen);
        this.router.get('/teacher/test/questions/:id', TestController_1.testController.listarPreguntasExamen);
        this.router.post('/teacher/test/questions', TestController_1.testController.agregarPreguntasExamen);
        this.router.put('/teacher/test/questions', TestController_1.testController.modificarPreguntaExamen);
        this.router.delete('/teacher/test/questions/:id', TestController_1.testController.eliminarPreguntaExamen);
    }
}
const testRoutes = new TestRoutes();
exports.default = testRoutes.router;
//# sourceMappingURL=TestRoutes.js.map