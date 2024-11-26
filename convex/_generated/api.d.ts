/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as fileStorage_INBOOK_X3_Slim from "../fileStorage-INBOOK_X3_Slim.js";
import type * as fileStorage from "../fileStorage.js";
import type * as schema_INBOOK_X3_Slim from "../schema-INBOOK_X3_Slim.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "fileStorage-INBOOK_X3_Slim": typeof fileStorage_INBOOK_X3_Slim;
  fileStorage: typeof fileStorage;
  "schema-INBOOK_X3_Slim": typeof schema_INBOOK_X3_Slim;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
