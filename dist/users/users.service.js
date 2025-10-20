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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
let UsersService = UsersService_1 = class UsersService {
    _db;
    logger = new common_1.Logger(UsersService_1.name);
    get db() {
        if (this._db) {
            return this._db;
        }
        if (admin.apps.length > 0) {
            this._db = admin.firestore();
            return this._db;
        }
        else {
            this.logger.warn('Firebase not initialized. Using mock database for UsersService.');
            return this.createMockDb();
        }
    }
    createMockDb() {
        const mockDoc = {
            get: () => Promise.resolve({ exists: false, data: () => null }),
            set: () => Promise.resolve(),
            update: () => Promise.resolve(),
            delete: () => Promise.resolve(),
        };
        const mockCollection = {
            doc: () => mockDoc,
            where: () => mockCollection,
            get: () => Promise.resolve({ empty: true, docs: [] }),
            add: () => Promise.resolve(mockDoc),
        };
        return {
            collection: () => mockCollection,
        };
    }
    async getUser(uid) {
        const userDoc = await this.db.collection('users').doc(uid).get();
        return userDoc.data();
    }
    async addFriend(uid, friendId) {
        await this.db.collection('users').doc(uid).update({
            friends: admin.firestore.FieldValue.arrayUnion(friendId),
        });
        return this.getUser(uid);
    }
    async removeFriend(uid, friendId) {
        await this.db.collection('users').doc(uid).update({
            friends: admin.firestore.FieldValue.arrayRemove(friendId),
        });
        return this.getUser(uid);
    }
    async getFriends(uid) {
        const user = await this.getUser(uid);
        if (!user.friends || user.friends.length === 0) {
            return [];
        }
        const friendsSnapshot = await this.db.collection('users').where(admin.firestore.FieldPath.documentId(), 'in', user.friends).get();
        return friendsSnapshot.docs.map(doc => doc.data());
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map