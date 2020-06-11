"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TestController_1 = require("../controllers/TestController");
class TestRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/images/get', TestController_1.testController.agregarExamen);
    }
}
const testRoutes = new TestRoutes();
exports.default = testRoutes.router;
//# sourceMappingURL=TestRoute.js.map