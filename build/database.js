"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const Keys_1 = __importDefault(require("./Keys"));
const pool = mysql_1.default.createPool(Keys_1.default.database);
pool.getConnection((err, connection) => {
    if (err)
        throw err;
    connection.release();
    console.log("Db is connected");
});
exports.default = pool;
//# sourceMappingURL=Database.js.map