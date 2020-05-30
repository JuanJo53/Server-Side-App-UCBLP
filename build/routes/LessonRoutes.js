"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonController_1 = require("../controllers/LessonController");
class LessonsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/modules/themes/lessons/:id', LessonController_1.lessonController.listarLecciones);
        this.router.post('/teacher/modules/themes/lessons/:id', LessonController_1.lessonController.agregarLeccion);
        this.router.put('/teacher/modules/themes/lessons/:id', LessonController_1.lessonController.editarLeccion);
        this.router.delete('/teacher/modules/themes/:id');
    }
}
const lessonsRoutes = new LessonsRoutes();
exports.default = lessonsRoutes.router;
//# sourceMappingURL=LessonRoutes.js.map