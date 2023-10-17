export type ILoginUser = {
  id: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  needsPasswordChange: boolean | undefined;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IPasswordChange = {
  currentPassword: string;
  newPassword: string;
};
