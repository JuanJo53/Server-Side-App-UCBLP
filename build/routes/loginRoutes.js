"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginController_1 = require("../controllers/LoginController");
const VerifyToken_1 = require("../libs/VerifyToken");
class LoginRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.post('/users/login', LoginController_1.loginController.validarDocente);
        this.router.post('/users/signup', LoginController_1.loginController.registrarDocente);
        this.router.get('/users', LoginController_1.loginController.listarDocentes);
        this.router.delete('/users/:id', LoginController_1.loginController.eliminarDocente);
        this.router.get('/users/profile', VerifyToken_1.TokenValidation, LoginController_1.loginController.listarDocente);
    }
}
const loginroutes = new LoginRoutes();
exports.default = loginroutes.router;
//# sourceMappingURL=LoginRoutes.js.map