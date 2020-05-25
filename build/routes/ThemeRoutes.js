"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ThemeRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/class-room');
        this.router.get('/teacher/class-room/prueba');
    }
}
const themeRoutes = new ThemeRoutes();
exports.default = themeRoutes.router;
//# sourceMappingURL=ThemeRoutes.js.map