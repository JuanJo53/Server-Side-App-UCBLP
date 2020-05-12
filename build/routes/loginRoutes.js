"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginController_1 = require("../controllers/LoginController");
class LoginRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/users/login', LoginController_1.loginController.validarUsuario);
        this.router.post('/users/signup', LoginController_1.loginController.registrarDocente);
        this.router.get('/users', LoginController_1.loginController.listarDocentes);
    }
}
const loginroutes = new LoginRoutes();
exports.default = loginroutes.router;
//# sourceMappingURL=LoginRoutes.js.map