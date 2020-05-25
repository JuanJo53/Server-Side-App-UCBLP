"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ThemeController_1 = require("../controllers/ThemeController");
class ImageRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/class-room/themes', ThemeController_1.themeController.listarTemas);
        this.router.post('/teacher/class-room/themes', ThemeController_1.themeController.agregarTema);
        this.router.put('/teacher/class-room/themes/:id', ThemeController_1.themeController.actualizarTema);
        this.router.delete('/teacher/class-room/themes/:id', ThemeController_1.themeController.eliminarTema);
    }
}
const imageRoutes = new ImageRoutes();
exports.default = imageRoutes.router;
//# sourceMappingURL=ImageRoutes.js.map