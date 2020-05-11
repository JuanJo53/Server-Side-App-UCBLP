"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LoginRoutes_1 = __importDefault(require("./routes/LoginRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    //configurar modulos
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    //configurar rutas
    routes() {
        this.app.use(LoginRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'));
        console.log("Server o port", this.app.get('port'));
    }
}
const server = new Server();
server.start();
//# sourceMappingURL=Index.js.map