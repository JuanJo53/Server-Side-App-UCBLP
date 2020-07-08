"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../libs/VerifyToken");
const ModuleController_1 = require("../controllers/ModuleController");
class ModuleRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.post('/teacher/evaluation', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.agregarModuloPersonalizado);
        this.router.get('/teacher/evaluation/:id', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.listarModulos);
        this.router.get('/teacher/evaluation/get/color', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.listarColores);
        this.router.get('/teacher/evaluation/get/personalized/:id', ModuleController_1.moduleController.listarModulosPersonalizados);
        this.router.put('/teacher/evaluation/personalized', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.editarModuloPersonalizado);
        this.router.put('/teacher/evaluation/predeterminated', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.editarModuloPredeterminado);
        this.router.put('/teacher/evaluation/disable/:id', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.desactivarModulo);
        this.router.put('/teacher/evaluation/enable/:id', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.activarModulo);
        this.router.delete('/teacher/evaluation/delete/:id', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.eliminarModulo);
        this.router.post('/teacher/evaluation/rubric', VerifyToken_1.TokenValidation, ModuleController_1.moduleController.actualizarRubricas);
    }
}
const moduleRoutes = new ModuleRoutes();
exports.default = moduleRoutes.router;
//# sourceMappingURL=ModuleRoutes.js.map