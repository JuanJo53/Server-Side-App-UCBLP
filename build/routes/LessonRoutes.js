"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class LessonsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/modules/themes/:id');
        this.router.post('/teacher/modules/themes');
        this.router.put('/teacher/modules/themes/');
        this.router.delete('/teacher/modules/themes/:id');
    }
}
const lessonsRoutes = new LessonsRoutes();
exports.default = lessonsRoutes.router;
//# sourceMappingURL=LessonRoutes.js.map