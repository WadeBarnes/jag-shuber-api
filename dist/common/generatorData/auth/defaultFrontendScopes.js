"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
/**
 * IMPORTANT! DO NOT REMOVE! These scopes MUST EXIST IN THE SYSTEM to allow frontend application components to display
 * and are populated into the database automatically if they don't exist.
 */
exports.defaultFrontendScopes = [
    /**
     * @scope SA_ALL_LOCATIONS
     */
    {
        scopeName: 'Special / Super Admin',
        scopeCode: 'SA_SPECIAL',
        systemScopeInd: true,
        description: 'Special privileges for the Super Admin user',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Users Page',
        scopeCode: 'ADMIN_PAGE_USERS',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin API Scopes',
        scopeCode: 'ADMIN_API_SCOPES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Frontend Scopes',
        scopeCode: 'ADMIN_FRONTEND_SCOPES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Courtrooms',
        scopeCode: 'ADMIN_COURTROOMS',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Court Roles',
        scopeCode: 'ADMIN_COURT_ROLES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Jail Roles',
        scopeCode: 'ADMIN_JAIL_ROLES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Escort Runs',
        scopeCode: 'ADMIN_ESCORT_TYPES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Other Assignments',
        scopeCode: 'ADMIN_OTHER_TYPES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Leave Types',
        scopeCode: 'ADMIN_LEAVE_TYPES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Training Types',
        scopeCode: 'ADMIN_TRAINING_TYPES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin Roles',
        scopeCode: 'ADMIN_ROLES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Admin User Roles',
        scopeCode: 'ADMIN_USER_ROLES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Sheriff Profile Identification',
        scopeCode: 'SHERIFF_PROFILE_IDENT',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Sheriff Profile Leaves',
        scopeCode: 'SHERIFF_PROFILE_LEAVES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Sheriff Profile Location',
        scopeCode: 'SHERIFF_PROFILE_LOCATION',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Sheriff Profile Roles',
        scopeCode: 'SHERIFF_PROFILE_ROLES',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    },
    {
        scopeName: 'Sheriff Profile Training',
        scopeCode: 'SHERIFF_PROFILE_TRAINING',
        systemScopeInd: true,
        description: '',
        createdBy: index_1.createdBy,
        updatedBy: index_1.updatedBy,
        createdDtm: index_1.createdDtm,
        updatedDtm: index_1.updatedDtm,
        revisionCount: 0
    }
];
//# sourceMappingURL=../../../../src/dist/common/generatorData/auth/defaultFrontendScopes.js.map