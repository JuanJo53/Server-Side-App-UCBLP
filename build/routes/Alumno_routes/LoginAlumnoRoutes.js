"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginAlumnoController_1 = require("../../controllers/Alumno_Controllers/LoginAlumnoController");
const VerifyTokenAlumno_1 = require("../../libs/VerifyTokenAlumno");
class LoginAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    config() {
        //  this.router.post('/students/login',loginController.validarDocente);
        this.router.put('/students/change/password/:id', LoginAlumnoController_1.loginAlumnoController.actucalizarContraseniaAlumno);
        this.router.post('/students/login', LoginAlumnoController_1.loginAlumnoController.validarAlumno);
        this.router.get('/students/profile', VerifyTokenAlumno_1.TokenValidationAlumno, LoginAlumnoController_1.loginAlumnoController.perfilAlumno);
    }
}
const loginAlumnoRoutes = new LoginAlumnoRoutes();
exports.default = loginAlumnoRoutes.router;
//# sourceMappingURL=LoginAlumnoRoutes.js.map