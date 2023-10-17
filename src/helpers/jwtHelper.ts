import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  data: object,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(data, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
  createToken,
  verifyToken,
};
