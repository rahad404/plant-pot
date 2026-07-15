import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Define your app's resources + allowed actions here.
// "project" and "billing" are examples — replace with your real resources.
const statement = {
   ...defaultStatements,
   project: ["create", "read", "update", "delete"],
   billing: ["view", "manage"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
   user: ac.newRole({
      project: ["create", "read"],
   }),
   admin: ac.newRole({
      ...adminAc.statements,
      project: ["create", "read", "update", "delete"],
      billing: ["view", "manage"],
   }),
};