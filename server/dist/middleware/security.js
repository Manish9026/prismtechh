"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySecurityMiddleware = void 0;
const csurf_1 = __importDefault(require("csurf"));
const applySecurityMiddleware = (app) => {
    // CSRF protection for non-API forms can be added selectively; for API we'll allow tokens via header
    const csrfProtection = (0, csurf_1.default)({ cookie: true });
    // Mount CSRF only on sensitive routes later (e.g., contact form, admin actions)
    app.set('csrfProtection', csrfProtection);
};
exports.applySecurityMiddleware = applySecurityMiddleware;
//# sourceMappingURL=security.js.map