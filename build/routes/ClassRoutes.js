"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassController_1 = require("../controllers/ClassController");
class ClassRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        //this.router.get('/teacher/class-room',TokenValidation,cursoController.obtenerCursosDocente);
        this.router.get('/teacher/my-class/students/:id', ClassController_1.classController.listaAlumnos);
    }
}
const classRoutes = new ClassRoutes();
exports.default = classRoutes.router;
//# sourceMappingURL=ClassRoutes.js.map