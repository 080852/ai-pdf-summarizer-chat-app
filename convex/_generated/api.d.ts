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
<<<<<<< HEAD
import type * as langchain_db from "../langchain/db.js";
import type * as myAction from "../myAction.js";
=======
import type * as schema_INBOOK_X3_Slim from "../schema-INBOOK_X3_Slim.js";
>>>>>>> 42379ecfe3dfb52e447a90d5ce1e93c54fc098cf
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
<<<<<<< HEAD
  "langchain/db": typeof langchain_db;
  myAction: typeof myAction;
=======
  "schema-INBOOK_X3_Slim": typeof schema_INBOOK_X3_Slim;
>>>>>>> 42379ecfe3dfb52e447a90d5ce1e93c54fc098cf
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
