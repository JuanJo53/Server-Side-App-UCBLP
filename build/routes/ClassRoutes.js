"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassController_1 = require("../controllers/ClassController");
const VerifyToken_1 = require("../libs/VerifyToken");
class ClassRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        //this.router.get('/teacher/class-room',TokenValidation,cursoController.obtenerCursosDocente);
        this.router.get('/teacher/my-class/students/:id', VerifyToken_1.TokenValidation, ClassController_1.classController.listaAlumnos);
        this.router.delete('/teacher/my-class/students/:id', VerifyToken_1.TokenValidation, ClassController_1.classController.bajaAlumnoCurso);
        this.router.post('/teacher/my-class/students/profile', VerifyToken_1.TokenValidation, ClassController_1.classController.obtenerAlumnoAltaCurso);
        this.router.post('/teacher/my-class/students', VerifyToken_1.TokenValidation, ClassController_1.classController.obtenerAlumnoAltaCurso);
    }
}
const classRoutes = new ClassRoutes();
exports.default = classRoutes.router;
//# sourceMappingURL=ClassRoutes.js.map