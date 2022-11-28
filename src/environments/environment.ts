// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAxIWcCA6BhngwYB-JuSleua4GaU6Tm_6Y",
    authDomain: "trove-crm.firebaseapp.com",
    projectId: "trove-crm",
    storageBucket: "trove-crm.appspot.com",
    messagingSenderId: "287909577050",
    appId: "1:287909577050:web:ebc04308247c94620fb363"
  },
  envName: 'Development',
  baseUrl: 'https://ct.trovecrm.in/api/v1/', //http://127.0.0.1:8000/api/v1/ | https://ct.trovecrm.in/api/v1/

  /** API Methods */
  /*======= Account ====================*/
  register: 'account/register',
  login: 'account/login',
  me: 'account/me',
  sendPasswordResetLink: 'account/sendPasswordResetLink',
  resetPassword: 'account/resetPassword',
  validateResetPasswordToken: 'account/validateResetPasswordToken',
  verifyEmail: 'account/verifyEmail',
  logout: 'account/logout',
  /*======= Settings ====================*/
  profile: 'settings/profile',
  profile_picture: 'settings/profile-picture',
  changePassword: 'settings/change-password',
  preference: 'settings/preference',
  users: 'settings/users',
  listusers: 'settings/users/index',
  roles: 'settings/roles',
  listroles: 'settings/roles/index',
  notifications: 'settings/notifications',
  pipelines: 'settings/pipeline',
  /*======= Company ====================*/
  company: 'organizations',
  company_index: 'organizations/index',
  company_detail: 'organizations/details',
  company_delete: 'organizations',
  company_delete_multiple: 'organizations?_method=DELETE',
  company_update_state: 'organizations/status',
  company_create_appointment: 'organizations/appointment',
  company_update_appointment: 'organizations/appointment',  
  company_appointment_state: 'organizations/appoint-status',
  company_create_task: 'organizations/task',
  company_update_task: 'organizations/task',
  company_task_state: 'organizations/task-status',
  company_delete_activity: 'activity',
  company_add_note: 'organizations/note',
  company_add_email: 'organizations/email',
  company_add_call: 'organizations/call',
  appointment_delete: 'appointment',
  task_delete: 'task',
  contacts: 'contacts',
  contacts_index: 'contacts/index',
  contacts_delete: 'contacts',
  contacts_delete_multiple: 'contacts?_method=DELETE',
  /*======= Lead ====================*/
  leads: 'leads',
  pipelineMaster: 'pipelines',
  leadFilter: 'leads/filter',
  /*======= Activity ====================*/
  verifyActivity: 'verify-acitivity',
  activity: 'activity',
  /*======== Dashboard ================*/
  dashboard:'dashboard',
  taskstatus:'task/task-status',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
