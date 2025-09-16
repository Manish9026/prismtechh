"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMember = void 0;
const mongoose_1 = require("mongoose");
const TeamMemberSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String },
    photo: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });
exports.TeamMember = (0, mongoose_1.model)('TeamMember', TeamMemberSchema);
//# sourceMappingURL=TeamMember.js.map