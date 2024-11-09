"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = require("./config/index");
const mongoose_1 = require("./infrastructure/database/mongoose");
const userRoutes_1 = __importDefault(require("./presentation/routes/userRoutes"));
const adminRoute_1 = __importDefault(require("./presentation/routes/adminRoute"));
const vendorRoutes_1 = __importDefault(require("./presentation/routes/vendorRoutes"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({ secret: index_1.config.sessionSecret, resave: false, saveUninitialized: true }));
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
app.use('/user', userRoutes_1.default);
app.use('/vendor', vendorRoutes_1.default);
app.use('/admin', adminRoute_1.default);
//  app.use('/VerifyLogin', (req: Request, res: Response) => {
//   console.log('Request received on /vendor route');
//   console.log('Request method:', req.method);
//   console.log('Request body:', req.body);
// });
const startServer = async () => {
    try {
        await (0, mongoose_1.connectDatabase)();
        app.listen(index_1.config.port, () => {
            console.log(`Server running on http://localhost:${index_1.config.port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
