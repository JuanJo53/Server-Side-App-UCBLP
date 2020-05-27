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
        this.router.post('/teacher/my-class/students/add-student', VerifyToken_1.TokenValidation, ClassController_1.classController.altaAlumnoCurso);
        this.router.get('/teacher/my-class/generate-assistance/:id', ClassController_1.classController.insertarAsistencia);
        this.router.get('/teacher/my-class/list-assistance/:id', ClassController_1.classController.listaAlumnosAsistencia);
        this.router.put('/teacher/my-class/update-assistance/:id', ClassController_1.classController.actualizarAsistencia);
        this.router.put('/teacher/my-class/assistance-dates/', ClassController_1.classController.listaFechasAsistencia);
    }
}
const classRoutes = new ClassRoutes();
exports.default = classRoutes.router;
//# sourceMappingURL=ClassRoutes.js.map