"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonController_1 = require("../controllers/LessonController");
const VerifyToken_1 = require("../libs/VerifyToken");
class LessonsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/modules/themes/lessons/:id', VerifyToken_1.TokenValidation, LessonController_1.lessonController.listarLecciones);
        this.router.post('/teacher/modules/themes/lessons/', VerifyToken_1.TokenValidation, LessonController_1.lessonController.agregarLeccion);
        this.router.put('/teacher/modules/themes/lessons/', VerifyToken_1.TokenValidation, LessonController_1.lessonController.editarLeccion);
        this.router.delete('/teacher/modules/themes/lessons/:id', VerifyToken_1.TokenValidation, LessonController_1.lessonController.eliminarLeccion);
    }
}
const lessonsRoutes = new LessonsRoutes();
exports.default = lessonsRoutes.router;
//# sourceMappingURL=LessonRoutes.js.map