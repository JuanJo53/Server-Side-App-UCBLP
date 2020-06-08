"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PreguntaController_1 = require("../controllers/PreguntaController");
class PreguntaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/question/type_of_question', PreguntaController_1.preguntaController.listarTipoPregunta);
        this.router.get('/teacher/question/type_of_answer', PreguntaController_1.preguntaController.listarTipoRespuesta);
        this.router.post('/teacher/question', PreguntaController_1.preguntaController.agregarPregunta);
        this.router.get('/teacher/question', PreguntaController_1.preguntaController.listarPreguntas);
    }
}
const preguntaRoutes = new PreguntaRoutes();
exports.default = preguntaRoutes.router;
//# sourceMappingURL=PreguntaRoutes.js.map