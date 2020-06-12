import moment from 'moment';
import uuidv4 from 'uuid/v4';
import { AutoWired, Container } from 'typescript-ioc';

import { createThrottle } from '../common/throttle';

import { ApiScopeService } from './ApiScopeService';
import { FrontendScopeService } from './FrontendScopeService';
import { FrontendScopeApiService } from './FrontendScopeApiService';
import { UserService } from './UserService';
import { CourtRoleCodeService } from './CourtRoleCodeService';
import { JailRoleCodeService } from './JailRoleCodeService';
import { OtherAssignCodeService } from './OtherAssignCodeService';

import { User } from '../models/User';
import { FrontendScope } from '../models/FrontendScope';
import { FrontendScopeApi } from '../models/FrontendScopeApi';
import { ApiScope } from '../models/ApiScope';
import { CourtRoleCode } from '../models/CourtRoleCode';
import { JailRoleCode } from '../models/JailRoleCode';
import { OtherAssignCode } from '../models/OtherAssignCode';

/**
 * Import the default system scopes configuration. These scopes, which are embedded in the user token, are required by the
 * frontend application and control which plugins, parts of the user interface, and which APIs a user can have access to.
 */
import {
    defaultFrontendScopes,
    defaultFrontendScopePermissions,
    defaultFrontendScopeApis,
    defaultApiScopes,
    defaultRoles,
    defaultSystemFrontendScopes,
    defaultSystemApiScopes,
    defaultCourtRoleCodes,
    defaultJailRoleCodes,
    defaultOtherAssignCodes
} from '../common/generatorData';

import {
    DEV_USER_AUTH_ID, DEV_USER_DISPLAY_NAME,
    SYSTEM_USER_DISPLAY_NAME
} from '../common/authentication';

const DEFAULT_LOCATION = process.env.SYS_DEFAULT_LOCATION || 'VIC'; // A default location CODE (GUID is useless since it's different across different environments and we don't know what they are until they're generated)
// for new sheriffs and users if none are defined. Used internally and under the hood by TokenService and GeneratorService.

import { SheriffService } from './SheriffService';
import { Sheriff } from '../models/Sheriff';
import { FrontendScopePermission } from '../models/FrontendScopePermission';
import { FrontendScopePermissionService } from './FrontendScopePermissionService';
import { RoleService } from './RoleService';
import { RoleFrontendScopeService } from './RoleFrontendScopeService';
import { RoleApiScopeService } from './RoleApiScopeService';
import { Role } from '../models/Role';
import { RoleApiScope } from '../models/RoleApiScope';
import { RoleFrontendScope } from '../models/RoleFrontendScope';
import { LocationService } from './LocationService';
import { RolePermissionService } from './RolePermissionService';
import { RolePermission } from '../models/RolePermission';

const MAX_RECORDS_PER_BATCH = 3;

@AutoWired
export class GeneratorService {
    /**
     * Re-generate any ApiScopes that are required by and missing in the system.
     * Default scopes are defined in src/common/generatorData
     */
    public async generateApiScopes() {
        const scopeService = Container.get(ApiScopeService);
        const ops = defaultApiScopes.map(async (scope: ApiScope) => {
            if (!(await scopeService.getByScopeCode(scope.scopeCode))) {
                return await scopeService.create(scope);
            }
        });

        await Promise.all(ops);
    }

    /**
     * Re-generate any FrontendScopes that are required by and missing in the system.
     * Default scopes are defined in src/common/generatorData
     */
    public async generateFrontendScopes() {
        const scopeService = Container.get(FrontendScopeService);
        const ops = defaultFrontendScopes.map(async (scope: FrontendScope) => {
            if (!(await scopeService.getByScopeCode(scope.scopeCode))) {
                return await scopeService.create(scope);
            }
        });

        await Promise.all(ops);
    }

    /**
     * Re-generate any FrontendScopes that are required by and missing in the system.
     * Default scopes are defined in src/common/generatorData
     */
    public async generateFrontendScopePermissions() {
        const scopeService = Container.get(FrontendScopeService);
        const scopePermissionService = Container.get(FrontendScopePermissionService);

        const frontendScopes = await scopeService.getAll();
        if (!(frontendScopes && frontendScopes.length > 0)) return;

        const outerOps = frontendScopes.map(async (scope: FrontendScope) => {
            const scopeEntity = await scopeService.getByScopeCode(scope.scopeCode);
            if (scopeEntity) {
                const innerOps = defaultFrontendScopePermissions
                    .filter(permission => permission.frontendScopeCode === scope.scopeCode)
                    .map(async (permission: FrontendScopePermission) => {
                        if (!(await scopePermissionService.getByCode(permission.permissionCode))) {
                            const newPermission = permission;
                            newPermission.frontendScopeId = scope.id;
                            return await scopePermissionService.create(newPermission);
                        }
                    });


                await Promise.all(innerOps);
            }
        });

        await Promise.all(outerOps);
    }

    /**
     * Re-generate any FrontendScopeApis that are required by and missing in the system.
     * Default scopes are defined in src/common/generatorData
     */
    public async generateFrontendScopeApis() {
        const scopeApiService = Container.get(FrontendScopeApiService);

        const frontendScopeService = Container.get(FrontendScopeService);
        const apiScopeService = Container.get(ApiScopeService);

        const frontendScopes = await frontendScopeService.getAll();
        if (!(frontendScopes && frontendScopes.length > 0)) return;

        const outerOps = frontendScopes.map(async (scope: FrontendScope) => {
            const scopeEntity = await frontendScopeService.getByScopeCode(scope.scopeCode);

            if (scopeEntity) {
                const innerOps = defaultFrontendScopeApis
                    .filter(frontendScopeApi => frontendScopeApi.frontendScopeCode === scope.scopeCode)
                    .map(async (api: FrontendScopeApi) => {
                        // Get 
                        const frontendScope = await frontendScopeService.getByScopeCode(api.frontendScopeCode);
                        const apiScope = await apiScopeService.getByScopeCode(api.apiScopeCode);

                        const scopeApi = await scopeApiService.getByFrontendAndApiScope(frontendScope, apiScope);
                        if (!scopeApi) {
                            const newApi = api;
                            newApi.frontendScopeId = frontendScope.id;
                            newApi.apiScopeId = apiScope.id;
                            return await scopeApiService.create(newApi);
                        }
                    });


                await Promise.all(innerOps);
            }
        });

        await Promise.all(outerOps);
    }

    /**
     * Re-generate any built-in roles that are required by and missing in the system.
     * Default scopes are defined in src/common/generatorData
     */
    public async generateSystemRolesAndScopes() {
        const roleService = Container.get(RoleService) as RoleService;
        const roleFrontendScopeService = Container.get(RoleFrontendScopeService) as RoleFrontendScopeService;
        const roleApiScopeService = Container.get(RoleApiScopeService) as RoleApiScopeService;
        const frontendScopeService = Container.get(FrontendScopeService) as FrontendScopeService;
        const frontendScopePermissionService = Container.get(FrontendScopePermissionService) as FrontendScopePermissionService;
        const rolePermissionService = Container.get(RolePermissionService) as RolePermissionService;
        const apiScopeService = Container.get(ApiScopeService) as ApiScopeService;

        const roleOps = defaultRoles.map(async (role: Role) => {
            if (!(await roleService.getByCode(role.roleCode))) {
                console.log(`Generating missing default role: ${role.roleCode}`);
                return await roleService.create(role);
            }
        });

        await Promise.all(roleOps);

        const fsThrottle = createThrottle(MAX_RECORDS_PER_BATCH);
        const fsOps = defaultSystemFrontendScopes.map((defaultRoleScope: any) => fsThrottle(async() => {
            const { roleCode, scopeCode } = defaultRoleScope;
            
            const role: Role = await roleService.getByCode(roleCode) as Role;
            const scope: FrontendScope = await frontendScopeService.getByScopeCode(scopeCode) as FrontendScope;

            let roleScope: RoleFrontendScope;
            const hasRoleScope = await roleFrontendScopeService.hasScope(scope.id);
            if (hasRoleScope) {
                const roleScopes = await roleFrontendScopeService.getByScopeId(scope.id);
                roleScope = roleScopes[0];
            }

            if (scope && !roleScope) {
                console.log(`Generating missing default scope [${scopeCode}] for role [${role.roleCode}]`);
                
                const newRoleScope = {
                    roleId: role.id,
                    scopeId: scope.id,
                    ...defaultRoleScope
                } as RoleFrontendScope;

                roleScope = await roleFrontendScopeService.create(newRoleScope);
            }

            return roleScope;
        }));

        await Promise.all(fsOps);

        const fsOuterThrottle = createThrottle(1);
        const fsInnerThrottle = createThrottle(MAX_RECORDS_PER_BATCH);
        const fsInnerOps = defaultSystemFrontendScopes.map((defaultRoleScope: any) => fsOuterThrottle(async() => {
            const { roleCode, scopeCode } = defaultRoleScope;
            
            const role: Role = await roleService.getByCode(roleCode) as Role;
            const scope: FrontendScope = await frontendScopeService.getByScopeCode(scopeCode) as FrontendScope;

            let roleScope: RoleFrontendScope;
            const hasRoleScope = await roleFrontendScopeService.hasScope(scope.id);
            if (hasRoleScope) {
                const roleScopes = await roleFrontendScopeService.getByScopeId(scope.id);
                roleScope = roleScopes[0];
            }

            // For each frontend scope, generate role permissions
            if (!scope.id) {
                console.warn(`Could not find any permissions for frontend scope [${scope.scopeCode}]`);
            } else {
                const frontendScopePermissions = frontendScopePermissionService.getByScopeId(scope.id);
                
                
                const fspOps = (await frontendScopePermissions).map((scopePermission: any) => fsInnerThrottle(async() => {
                    const rolePermissions = await rolePermissionService.getByRoleFrontendScopeId(roleScope.id);
                    if (rolePermissions) {
                        // console.log(`Found the following role permissions for frontend scope [${scope.scopeCode}]`);
                        // console.log(rolePermissions);    
                    }

                    let rolePermission: RoleFrontendScope;
                    const hasRolePermission = rolePermissions.find((rp: RolePermission) => rp.frontendScopePermissionId === scopePermission.id);

                    if (!hasRolePermission) {
                        console.log(`Generating missing default permission [${scopePermission.permissionCode}] for [${scope.scopeCode}] for role [${role.roleCode}]`);
                        const newRolePermission = {
                            roleId: role.id,
                            roleApiScopeId: null,
                            roleFrontendScopeId: roleScope.id,
                            apiScopePermissionId: null,
                            frontendScopePermissionId: scopePermission.id,
                            createdBy: scopePermission.createdBy,
                            updatedBy: scopePermission.updatedBy,
                            createdDtm: new Date(scopePermission.createdDtm).toISOString(),
                            updatedDtm: new Date(scopePermission.updatedDtm).toISOString(),
                            revisionCount: scopePermission.revisionCount
                        } as RolePermission;

                        rolePermission = await rolePermissionService.create(newRolePermission);
                    }

                    return rolePermission;
                }));

                await Promise.all(fspOps);
            }
        }));

        await Promise.all(fsInnerOps);
        
        const asThrottle = createThrottle(MAX_RECORDS_PER_BATCH);
        const asOps = defaultSystemApiScopes.map((defaultRoleScope: any) => asThrottle(async() => {
            const { roleCode, scopeCode } = defaultRoleScope;

            const role: Role = await roleService.getByCode(roleCode) as Role;
            const scope: ApiScope = await apiScopeService.getByScopeCode(scopeCode) as ApiScope;
            
            let roleScope: RoleApiScope;
            const hasRoleScope = await roleApiScopeService.hasScope(scope.id);
            if (hasRoleScope) {
                const roleScopes = await roleApiScopeService.getByScopeId(scope.id);
                roleScope = roleScopes[0];
            }
            
            if (scope && !roleScope) {
                const newRoleScope = {
                    roleId: role.id,
                    scopeId: scope.id,
                    ...defaultRoleScope
                } as RoleApiScope;

                roleScope = await roleApiScopeService.create(newRoleScope);
            }

            return roleScope;
        }));

        await Promise.all(asOps);
    }

    /**
     * Get or create the dev user. The dev user is only used when developing locally, where a Siteminder user does not
     * exist (unless configured using FakeMinder or some other mock implementation) and is granted full access to
     * frontend plugins and components, user interface features, and all API routes / OAuth scopes.
     */
    public async getOrCreateDevUser(): Promise<User | undefined> {
        // No admin user was found using the token, check to see if the test user account exists
        console.log(`Check to see if the dev user account exists`);
        const userService = Container.get(UserService);
        let user = await userService.getByToken({ siteminderId: null, userId: DEV_USER_AUTH_ID });
        if (!user) {
            const locationService = Container.get(LocationService);
            const location = await locationService.getByCode(DEFAULT_LOCATION);
            console.log(`GeneratorServiceException: Could not find the dev user account - creating a new test account.`);
            user = await userService.create({
                displayName: DEV_USER_DISPLAY_NAME,
                siteminderId: uuidv4(), // TODO: Can't ignore unless we drop the constraint, but we won't have one, use a random value for now...
                userAuthId: DEV_USER_AUTH_ID, // 7 chars, same as IDIR
                defaultLocationId: (location) ? location.id : null, // GUID TODO: Set a default location for the user and make it configurable via OpenShift
                systemAccountInd: 1, // Is the user a system user
                sheriffId: null, // If the user is a sheriff, this needs to be populated
                createdBy: SYSTEM_USER_DISPLAY_NAME,
                updatedBy: SYSTEM_USER_DISPLAY_NAME,
                createdDtm: moment(new Date()).toISOString(),
                updatedDtm: moment(new Date()).toISOString(),
                revisionCount:0
            } as User);
            console.log(`Using user account: ${user.displayName} [${user.id}]`);
        } else {
            console.log(`Dev user account exists`);
        }

        return user;
    }

    /**
     * Sheriffs in the system were built before we added in user functionality. As result, sheriffs currently being
     * loaded into the system via Liquibase don't have user accounts. We will need to create user accounts for any
     * sheriffs that don't have user accounts (which will be all of them as of the time of this writing 2020-01-12 yyyy-mm-dd).
     */
    public async generateUsersForSheriffs(): Promise<void> {
        // Get all the sheriffs
        const sheriffService = Container.get(SheriffService);
        const userService = Container.get(UserService);
        const rows = await sheriffService.getAll();

        const throttle = createThrottle(MAX_RECORDS_PER_BATCH);
        const ops = rows.map(sheriffEntity => throttle(async() => {
            // TODO: Set a limit, we'll need to throttle this or something...
            // Increate the number of records and this starts to blow up, probably too much memory.
            if (sheriffEntity.id) {
                const userEntity = await userService.getBySheriffId(sheriffEntity.id);
                if (!userEntity) {
                    console.log(`Generating user for sheriff_id: ${sheriffEntity.id}`);
                    await this.generateUserForSheriff(sheriffEntity);
                }
            }
        }));

        await Promise.all(ops);
    }

    private async generateUserForSheriff(sheriff: Sheriff): Promise<User | undefined> {
        const userService = Container.get(UserService);

        try {
            const userLocation = sheriff.homeLocationId || DEFAULT_LOCATION
            const newUserEntity = await userService.create({
                displayName: `${sheriff.firstName} ${sheriff.lastName}`,
                systemAccountInd: 0,
                siteminderId: uuidv4(), // TODO: Can't ignore unless we drop the constraint, but we won't have one, use a random value for now...
                userAuthId: null, // TODO: This is where we can load in auth ids for sheriffs
                defaultLocationId: null, // TODO: This field is basically useless, location is on the sheriff
                sheriffId: sheriff.id,
                effectiveDate: new Date().toISOString(),
                expiryDate: null,
                createdBy: SYSTEM_USER_DISPLAY_NAME,
                updatedBy: SYSTEM_USER_DISPLAY_NAME,
                createdDtm: new Date().toISOString(),
                updatedDtm: new Date().toISOString(),
                revisionCount: 0
            });

            console.log(`Generated user "${newUserEntity.id}" for sheriff_id: ${newUserEntity.sheriffId}, name: ${newUserEntity.displayName}`);
            return newUserEntity;

        } catch (err) {
            console.log(`Error generating user for sheriff_id: ${sheriff.id}`)
        }
    }

    /**
     * Re-generate any built-in codes that are required by and missing in the system.
     */
    public async generateCourtRoleCodes() {
        const codeService = Container.get(CourtRoleCodeService) as CourtRoleCodeService;
        const locationService = Container.get(LocationService) as LocationService;

        const locations = await locationService.getAll();

        const codeOps = defaultCourtRoleCodes.map(async (code: CourtRoleCode) => {
            const hasCode = await codeService.getByCodeAndLocation(code.code, null);
            if (!(hasCode)) {
                code.id = uuidv4();
                code.locationId = null
                return await codeService.create(code) as CourtRoleCode;
            }
        });

        await Promise.all(codeOps);

        // Uncomment this to test custom assignment type generation
        /* const throttle = createThrottle(MAX_RECORDS_PER_BATCH);
        const ops = locations.map(location => throttle(async() => {
            // TODO: Set a limit, we'll need to throttle this or something...
            // Increate the number of records and this starts to blow up, probably too much memory.
            if (location.id) {
                const codeOps = defaultCourtRoleCodes.map(async (code: CourtRoleCode) => {
                    const hasCode = await codeService.getByCodeAndLocation(code.code, location.id);
                    if (!(hasCode)) {
                        code.id = uuidv4();
                        code.locationId = location.id;
                        return await codeService.create(code) as CourtRoleCode;
                    }
                });

                await Promise.all(codeOps);
            }
        }));

        await Promise.all(ops); */
    }

    /**
     * Re-generate any built-in codes that are required by and missing in the system.
     */
    public async generateJailRoleCodes() {
        const codeService = Container.get(JailRoleCodeService) as JailRoleCodeService;
        const locationService = Container.get(LocationService) as LocationService;

        const locations = await locationService.getAll();

        const codeOps = defaultJailRoleCodes.map(async (code: JailRoleCode) => {
            const hasCode = await codeService.getByCodeAndLocation(code.code, null);
            if (!(hasCode)) {
                code.id = uuidv4();
                code.locationId = null;
                return await codeService.create(code) as JailRoleCode;
            }
        });

        await Promise.all(codeOps);

        // Uncomment this to test custom assignment type generation
        /* const throttle = createThrottle(MAX_RECORDS_PER_BATCH);
        const ops = locations.map(location => throttle(async() => {
            // TODO: Set a limit, we'll need to throttle this or something...
            // Increate the number of records and this starts to blow up, probably too much memory.
            if (location.id) {
                const codeOps = defaultJailRoleCodes.map(async (code: JailRoleCode) => {
                    const hasCode = await codeService.getByCodeAndLocation(code.code, location.id);
                    if (!(hasCode)) {
                        code.id = uuidv4();
                        code.locationId = location.id;
                        return await codeService.create(code) as JailRoleCode;
                    }
                });

                await Promise.all(codeOps);
            }
        }));

        await Promise.all(ops); */
    }

    /**
     * Re-generate any built-in codes that are required by and missing in the system.
     */
    public async generateOtherAssignCodes() {
        const codeService = Container.get(OtherAssignCodeService) as OtherAssignCodeService;
        const locationService = Container.get(LocationService) as LocationService;

        const locations = await locationService.getAll();

        const codeOps = defaultOtherAssignCodes.map(async (code: OtherAssignCode) => {
            const hasCode = await codeService.getByCodeAndLocation(code.code, null);
            if (!(hasCode)) {
                code.id = uuidv4();
                code.locationId = null;
                return await codeService.create(code) as OtherAssignCode;
            }
        });

        await Promise.all(codeOps);

        // Uncomment this to test custom assignment type generation
        /* const throttle = createThrottle(MAX_RECORDS_PER_BATCH);
        const ops = locations.map(location => throttle(async() => {
            // TODO: Set a limit, we'll need to throttle this or something...
            // Increate the number of records and this starts to blow up, probably too much memory.
            if (location.id) {
                const codeOps = defaultOtherAssignCodes.map(async (code: OtherAssignCode) => {
                    const hasCode = await codeService.getByCodeAndLocation(code.code, location.id);
                    if (!(hasCode)) {
                        code.id = uuidv4();
                        code.locationId = location.id;
                        return await codeService.create(code) as OtherAssignCode;
                    }
                });

                await Promise.all(codeOps);
            }
        }));

        await Promise.all(ops); */
    }
}
