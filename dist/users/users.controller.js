"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const add_friend_dto_1 = require("./dto/add-friend.dto");
const save_event_dto_1 = require("./dto/save-event.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getMe(req) {
        return {
            uid: req.user.uid,
            email: 'test@example.com',
            displayName: 'Mock User',
            friends: [],
            attendingEvents: [],
            savedEvents: [],
        };
    }
    async updateMe(req, updateUserDto) {
        return {
            uid: req.user.uid,
            email: 'test@example.com',
            displayName: updateUserDto.displayName || 'Mock User',
            friends: [],
            attendingEvents: [],
            savedEvents: [],
        };
    }
    async addFriend(req, addFriendDto) {
        const uid = req.user.uid;
        return this.usersService.addFriend(uid, addFriendDto.friendId);
    }
    async removeFriend(req, friendId) {
        const uid = req.user.uid;
        return this.usersService.removeFriend(uid, friendId);
    }
    async getFriends(req) {
        const uid = req.user.uid;
        return this.usersService.getFriends(uid);
    }
    async saveEvent(req, saveEventDto) {
        const uid = req.user.uid;
        return this.usersService.saveEvent(uid, saveEventDto.eventId);
    }
    async removeSavedEvent(req, eventId) {
        const uid = req.user.uid;
        return this.usersService.removeSavedEvent(uid, eventId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Post)('friends'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_friend_dto_1.AddFriendDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Delete)('friends/:friendId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Get)('friends'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Post)('saved-events'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, save_event_dto_1.SaveEventDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "saveEvent", null);
__decorate([
    (0, common_1.Delete)('saved-events/:eventId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeSavedEvent", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map