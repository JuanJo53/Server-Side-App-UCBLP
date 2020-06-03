"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ForoController_1 = require("../controllers/ForoController");
class ForoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.post('/teacher/forums', ForoController_1.foroController.crearForo);
        this.router.get('/teacher/forums', ForoController_1.foroController.listarForos);
        this.router.put('/teacher/forums/:id', ForoController_1.foroController.modificarForos);
        this.router.delete('/teacher/forums', ForoController_1.foroController.eliminarForo);
    }
}
const foroRoutes = new ForoRoutes();
exports.default = foroRoutes.router;
//# sourceMappingURL=ForoRoutes.js.map