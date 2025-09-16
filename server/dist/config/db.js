"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDatabase() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prism_tech';
    mongoose_1.default.set('strictQuery', true);
    return mongoose_1.default.connect(mongoUri, {
        autoIndex: true,
    });
}
//# sourceMappingURL=db.js.map