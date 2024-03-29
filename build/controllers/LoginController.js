"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../Database"));
const tokenService_1 = require("../libs/tokenService");
class LoginController {
    //Validar inicio de sesión 
    //Para probarlo utiliza este json : {"correo_docente":"m.ticona@acad.ucb.edu.bo","contrasenia_docente":"1234abc"}
    validarDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Guardamos el correo y la contraseña en variables
            const tokenService = new tokenService_1.TokenService();
            console.log(req.headers);
            const correoDocente = req.body.correoDocente;
            const contraseniaDocente = req.body.contraseniaDocente;
            console.log("Correo: " + correoDocente);
            console.log("Contra: " + contraseniaDocente);
            const query = `SELECT  id_docente, correo_docente,contrasenia_docente FROM docente WHERE  estado_docente = true 
                      AND correo_docente = ?`;
            yield Database_1.default.query(query, [correoDocente], function (err, result, fields) {
                if (err)
                    throw err;
                //Si el resultado retorna un docente con esos datos se valida el ingreso
                if (result.length > 0) {
                    if (tokenService.valPass(contraseniaDocente, result[0].contrasenia_docente)) {
                        const token = tokenService.getToken(result[0].id_docente);
                        console.log("Token: " + token);
                        res.json({
                            //  user:correoDocente,
                            token: token
                        });
                        console.log("Entra");
                    }
                    else {
                        res.json({ text: "Usuario no validado" });
                        console.log("No entra por contrasenia");
                    }
                }
                else {
                    res.json({ text: "Usuario no validado" });
                    console.log("No entra por correo");
                }
            });
        });
    }
    //Listar docentes activos
    listarDocentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT id_docente,nombre_docente,ap_pat_docente, ap_mat_docente, correo_docente,
       contrasenia_docente FROM docente where estado_docente =true;`;
            yield Database_1.default.query(query, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    listarDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.docenteId;
            console.log("ID: " + id);
            const query = `SELECT nombre_docente,ap_pat_docente, ap_mat_docente, correo_docente
        FROM docente where estado_docente =true AND id_docente = ?`;
            yield Database_1.default.query(query, [id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result[0]);
                //console.log()
            });
        });
    }
    //Registrar un nuevo docente
    registrarDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenService = new tokenService_1.TokenService();
            req.body.contraseniaDocente = tokenService.criptPass(req.body.contraseniaDocente);
            Database_1.default.query('INSERT INTO docente set ?', [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                const token = tokenService.getToken(req.body.correoDocente);
                res.json(token);
            });
        });
    }
    //Eliminar un docente
    eliminarDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield Database_1.default.query('UPDATE docente SET estado_docente = false WHERE id_docente = ?', [id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json({ text: 'Eliminando docente' });
            });
        });
    }
}
exports.loginController = new LoginController();
//# sourceMappingURL=LoginController.js.map