import { UserWithRoles } from "../services/user.service";

type ReqContextVariables = { [key: string]: any } & { user?: UserWithRoles };

export class ReqContext {
  public variables: ReqContextVariables = {};

  constructor() {}

  public get user(): UserWithRoles | undefined {
    return this.variables.user;
  }

  public set user(user: UserWithRoles | undefined) {
    this.variables.user = user;
  }
}

declare global {
  namespace Express {
    interface Request {
      context: ReqContext;
    }
  }
}
