"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
let Teacher = class Teacher {
    criptPassword() {
        const salt = bcrypt_1.default.genSaltSync(10);
        this.contrasenia_docente = bcrypt_1.default.hashSync(this.contrasenia_docente, salt);
    }
    //!!Verificar si funciona cuando las funciones son asyncronas
    checkPassword(password) {
        return bcrypt_1.default.compareSync(password, this.contrasenia_docente);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Teacher.prototype, "id_docente", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Teacher.prototype, "nombre_docente", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Teacher.prototype, "ap_pat_docente", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Teacher.prototype, "ap_mat_docente", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Teacher.prototype, "correo_docente", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Teacher.prototype, "contrasenia_docente", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Teacher.prototype, "estado_docente", void 0);
Teacher = __decorate([
    typeorm_1.Entity()
], Teacher);
exports.Teacher = Teacher;
//# sourceMappingURL=Teacher.js.map