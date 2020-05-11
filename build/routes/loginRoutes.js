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
        this.router.get('/users', LoginController_1.loginController.login);
    }
}
const loginroutes = new LoginRoutes();
exports.default = loginroutes.router;
//# sourceMappingURL=LoginRoutes.js.map