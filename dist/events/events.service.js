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
var EventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
let EventsService = EventsService_1 = class EventsService {
    _db;
    logger = new common_1.Logger(EventsService_1.name);
    get db() {
        if (this._db) {
            return this._db;
        }
        if (admin.apps.length > 0) {
            this._db = admin.firestore();
            return this._db;
        }
        else {
            this.logger.warn('Firebase not initialized. Using mock database for EventsService.');
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
    async createEvent(event, creatorUid) {
        const eventData = {
            ...event,
            creator: creatorUid,
            attendees: [creatorUid],
        };
        const docRef = await this.db.collection('events').add(eventData);
        return { ...eventData, id: docRef.id };
    }
    async getEvent(id) {
        const doc = await this.db.collection('events').doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Event not found');
        }
        return { ...doc.data(), id: doc.id };
    }
    async getEvents() {
        const snapshot = await this.db.collection('events').get();
        return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }
    async updateEvent(id, event, userId) {
        const eventToUpdate = await this.getEvent(id);
        if (eventToUpdate.creator !== userId) {
            throw new common_1.UnauthorizedException('You are not the creator of this event.');
        }
        const updateData = Object.entries(event).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        if (Object.keys(updateData).length > 0) {
            await this.db.collection('events').doc(id).update(updateData);
        }
        return this.getEvent(id);
    }
    async deleteEvent(id, userId) {
        const eventToDelete = await this.getEvent(id);
        if (eventToDelete.creator !== userId) {
            throw new common_1.UnauthorizedException('You are not the creator of this event.');
        }
        await this.db.collection('events').doc(id).delete();
    }
    async attendEvent(eventId, userId) {
        await this.db
            .collection('events')
            .doc(eventId)
            .update({
            attendees: admin.firestore.FieldValue.arrayUnion(userId),
        });
        await this.db
            .collection('users')
            .doc(userId)
            .update({
            attendingEvents: admin.firestore.FieldValue.arrayUnion(eventId),
        });
        return this.getEvent(eventId);
    }
    async unattendEvent(eventId, userId) {
        await this.db
            .collection('events')
            .doc(eventId)
            .update({
            attendees: admin.firestore.FieldValue.arrayRemove(userId),
        });
        await this.db
            .collection('users')
            .doc(userId)
            .update({
            attendingEvents: admin.firestore.FieldValue.arrayRemove(eventId),
        });
        return this.getEvent(eventId);
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = EventsService_1 = __decorate([
    (0, common_1.Injectable)()
], EventsService);
//# sourceMappingURL=events.service.js.map