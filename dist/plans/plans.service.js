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
var PlansService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
let PlansService = PlansService_1 = class PlansService {
    _db;
    logger = new common_1.Logger(PlansService_1.name);
    get db() {
        if (this._db) {
            return this._db;
        }
        if (admin.apps.length > 0) {
            this._db = admin.firestore();
            return this._db;
        }
        else {
            this.logger.warn('Firebase not initialized. Using mock database for PlansService.');
            return this.createMockDb();
        }
    }
    createMockDb() {
        const mockPlan = {
            id: 'mock-plan-id',
            eventId: 'mock-event-id',
            createdBy: 'mock-user-id',
            invitedFriends: 1,
            status: 'active',
            invitedContacts: ['contact1@example.com'],
        };
        const mockEventDoc = {
            get: () => Promise.resolve({ exists: true, data: () => ({ name: 'Mock Event' }) }),
        };
        const mockPlanDoc = {
            get: () => Promise.resolve({ exists: true, data: () => mockPlan }),
            set: () => Promise.resolve(),
            update: () => Promise.resolve(),
            delete: () => Promise.resolve(),
            id: 'mock-plan-id',
        };
        const collections = {
            events: {
                doc: () => mockEventDoc,
            },
            plans: {
                doc: () => mockPlanDoc,
                where: () => collections.plans,
                get: () => Promise.resolve({ empty: false, docs: [{ data: () => mockPlan, id: 'mock-plan-id' }] }),
                add: () => Promise.resolve(mockPlanDoc),
            },
        };
        return {
            collection: (name) => collections[name],
        };
    }
    async createPlan(eventId, createdBy, invitedContacts) {
        const eventDoc = await this.db.collection('events').doc(eventId).get();
        if (!eventDoc.exists) {
            throw new common_1.NotFoundException('Event not found');
        }
        const planData = {
            eventId,
            createdBy,
            invitedFriends: invitedContacts?.length ?? 0,
            status: 'active',
            invitedContacts,
        };
        const docRef = await this.db.collection('plans').add(planData);
        for (const phone of invitedContacts ?? []) {
            this.logger.log(`Sending SMS invite for event ${eventId} to ${phone}`);
        }
        return { ...planData, id: docRef.id };
    }
    async getMyPlans(uid) {
        const snapshot = await this.db
            .collection('plans')
            .where('createdBy', '==', uid)
            .get();
        return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = PlansService_1 = __decorate([
    (0, common_1.Injectable)()
], PlansService);
//# sourceMappingURL=plans.service.js.map