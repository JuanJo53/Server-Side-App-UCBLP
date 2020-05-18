"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CursoController_1 = require("../controllers/CursoController");
const VerifyToken_1 = require("../libs/VerifyToken");
class CursoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/class-room/', VerifyToken_1.TokenValidation, CursoController_1.cursoController.obtenerCursosDocente);
    }
}
const cursoRoutes = new CursoRoutes();
exports.default = cursoRoutes.router;
//# sourceMappingURL=CursoRoutes.js.map