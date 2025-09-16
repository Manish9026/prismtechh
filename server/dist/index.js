"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const security_1 = require("./middleware/security");
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Core middleware
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
const corsOriginEnv = process.env.CORS_ORIGIN || '';
const allowedOrigins = corsOriginEnv
    ? corsOriginEnv.split(',').map((s) => s.trim()).filter(Boolean)
    : ['http://localhost:5173'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, morgan_1.default)('dev'));
// Rate limiting for security
const limiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api/', limiter);
// Additional security middleware
(0, security_1.applySecurityMiddleware)(app);
// API routes
app.use('/api', routes_1.default);
// Static uploads for local storage
app.use('/uploads', express_1.default.static(node_path_1.default.resolve(process.cwd(), 'uploads')));
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
const PORT = process.env.PORT || 5000;
(0, db_1.connectDatabase)()
    .then(() => {
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to database', err);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map