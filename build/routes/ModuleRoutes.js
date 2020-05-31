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
        this.router.post('/teacher/modules', ModuleController_1.moduleController.agregarModuloPersonalizado);
        this.router.get('/teacher/modules', ModuleController_1.moduleController.listarModulos);
        this.router.put('/teacher/modules/personalized/:id', ModuleController_1.moduleController.editarModuloPersonalizado);
        this.router.put('/teacher/modules/predeterminated/:id', ModuleController_1.moduleController.editarModuloPredeterminado);
        this.router.put('/teacher/modules/disable/:id', ModuleController_1.moduleController.desactivarModulo);
        this.router.put('/teacher/modules/enable/:id', ModuleController_1.moduleController.activarModulo);
        this.router.delete('/teacher/modules/delete/:id', ModuleController_1.moduleController.eliminarModulo);
    }
}
const moduleRoutes = new ModuleRoutes();
exports.default = moduleRoutes.router;
//# sourceMappingURL=ModuleRoutes.js.map