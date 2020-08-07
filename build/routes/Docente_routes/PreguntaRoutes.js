"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../../libs/VerifyToken");
const PreguntaController_1 = require("../../controllers/Docente_controllers/PreguntaController");
class PreguntaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/question/type_of_question', VerifyToken_1.TokenValidation, PreguntaController_1.preguntaController.listarTipoPregunta);
        this.router.get('/teacher/question/type_of_answer', VerifyToken_1.TokenValidation, PreguntaController_1.preguntaController.listarTipoRespuesta);
        this.router.post('/teacher/question', VerifyToken_1.TokenValidation, PreguntaController_1.preguntaController.agregarPregunta);
        this.router.get('/teacher/question', VerifyToken_1.TokenValidation, PreguntaController_1.preguntaController.listarPreguntas2);
        this.router.get('/teacher/questionSQL', VerifyToken_1.TokenValidation, PreguntaController_1.preguntaController.listarPreguntasSQL);
    }
}
const preguntaRoutes = new PreguntaRoutes();
exports.default = preguntaRoutes.router;
//# sourceMappingURL=PreguntaRoutes.js.map