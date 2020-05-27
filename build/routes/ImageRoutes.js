"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../libs/VerifyToken");
const ImageController_1 = require("../controllers/ImageController");
class ImageRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/class-room/themes/images', VerifyToken_1.TokenValidation, ImageController_1.imageController.listarImagenes);
    }
}
const imageRoutes = new ImageRoutes();
exports.default = imageRoutes.router;
//# sourceMappingURL=ImageRoutes.js.map