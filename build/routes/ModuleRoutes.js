"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ModuleController_1 = require("../controllers/ModuleController");
class ModuleRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.post('/teacher/evaluation', ModuleController_1.moduleController.agregarModuloPersonalizado);
        this.router.get('/teacher/evaluation/:id', ModuleController_1.moduleController.listarModulos);
        this.router.get('/teacher/evaluation/get/color', ModuleController_1.moduleController.listarColores);
        this.router.put('/teacher/evaluation/personalized/', ModuleController_1.moduleController.editarModuloPersonalizado);
        this.router.put('/teacher/evaluation/predeterminated/', ModuleController_1.moduleController.editarModuloPredeterminado);
        this.router.put('/teacher/evaluation/disable/:id', ModuleController_1.moduleController.desactivarModulo);
        this.router.put('/teacher/evaluation/enable/:id', ModuleController_1.moduleController.activarModulo);
        this.router.delete('/teacher/evaluation/delete/:id', ModuleController_1.moduleController.eliminarModulo);
    }
}
const moduleRoutes = new ModuleRoutes();
exports.default = moduleRoutes.router;
//# sourceMappingURL=ModuleRoutes.js.map