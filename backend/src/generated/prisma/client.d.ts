import * as runtime from "@prisma/client/runtime/library";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.users.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model users
 *
 */
export type users = Prisma.usersModel;
/**
 * Model families
 *
 */
export type families = Prisma.familiesModel;
/**
 * Model family_branches
 *
 */
export type family_branches = Prisma.family_branchesModel;
/**
 * Model members
 *
 */
export type members = Prisma.membersModel;
/**
 * Model member_profiles
 *
 */
export type member_profiles = Prisma.member_profilesModel;
/**
 * Model marriages
 *
 */
export type marriages = Prisma.marriagesModel;
/**
 * Model parent_child_relationships
 *
 */
export type parent_child_relationships = Prisma.parent_child_relationshipsModel;
/**
 * Model family_documents
 *
 */
export type family_documents = Prisma.family_documentsModel;
/**
 * Model roles
 *
 */
export type roles = Prisma.rolesModel;
/**
 * Model family_members
 *
 */
export type family_members = Prisma.family_membersModel;
/**
 * Model posts
 *
 */
export type posts = Prisma.postsModel;
/**
 * Model post_comments
 *
 */
export type post_comments = Prisma.post_commentsModel;
/**
 * Model post_reactions
 *
 */
export type post_reactions = Prisma.post_reactionsModel;
/**
 * Model events
 *
 */
export type events = Prisma.eventsModel;
/**
 * Model event_rsvps
 *
 */
export type event_rsvps = Prisma.event_rsvpsModel;
/**
 * Model ai_chat_histories
 *
 */
export type ai_chat_histories = Prisma.ai_chat_historiesModel;
//# sourceMappingURL=client.d.ts.map