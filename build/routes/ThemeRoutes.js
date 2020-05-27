"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ThemeController_1 = require("../controllers/ThemeController");
const VerifyToken_1 = require("../libs/VerifyToken");
class ThemeRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/modules/themes/:id', VerifyToken_1.TokenValidation, ThemeController_1.themeController.listarTemas);
        this.router.post('/teacher/modules/themes', VerifyToken_1.TokenValidation, ThemeController_1.themeController.agregarTema);
        this.router.put('/teacher/modules/themes/:id', VerifyToken_1.TokenValidation, ThemeController_1.themeController.actualizarTema);
        this.router.delete('/teacher/modules/themes/:id', VerifyToken_1.TokenValidation, ThemeController_1.themeController.eliminarTema);
    }
}
const themeRoutes = new ThemeRoutes();
exports.default = themeRoutes.router;
//# sourceMappingURL=ThemeRoutes.js.map