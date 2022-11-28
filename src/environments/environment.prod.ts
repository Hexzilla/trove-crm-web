export const environment = {
  production: true,
  envName: 'prod',
  baseUrl: 'http://apimikontact.cullsy.com/api/',

  /** API Methods */
  register: 'account/register',
  login: 'account/login',
  me: 'account/me',
  sendPasswordResetLink: 'account/sendPasswordResetLink',
  resetPassword: 'account/resetPassword',
  validateResetPasswordToken: 'account/validateResetPasswordToken',

  logout: 'account/logout',
};
