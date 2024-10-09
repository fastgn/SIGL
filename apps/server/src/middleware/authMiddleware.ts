import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  headers: {
    authorization?: string;
  };
  user?: JwtPayload;
}

const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = decoded as JwtPayload;
      next();
    },
  );
};

export default authenticateToken;
