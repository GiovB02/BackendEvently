"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = __importDefault(require("express"));
const admin = __importStar(require("firebase-admin"));
const platform_express_1 = require("@nestjs/platform-express");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const common_1 = require("@nestjs/common");
async function bootstrap() {
    if (admin.apps.length === 0) {
        try {
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                });
            }
            else {
                const keyPath = node_path_1.default.join(__dirname, '..', 'serviceAccountKey.json');
                if (node_fs_1.default.existsSync(keyPath)) {
                    const raw = node_fs_1.default.readFileSync(keyPath, 'utf-8');
                    const serviceAccount = JSON.parse(raw);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                }
                else {
                    console.warn('No Firebase credentials found. Skipping initialization.');
                }
            }
        }
        catch (e) {
            console.warn('Firebase Admin initialization skipped:', e);
        }
    }
    const server = (0, express_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    const port = process.env.PORT ? Number(process.env.PORT) : 3001;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map