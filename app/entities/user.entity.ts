export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  PROFESSIONAL = 'PROFESSIONAL',
  REVIEWER = 'REVIEWER',
  GUEST = 'GUEST',
}

export interface User {
  _id: string;
  email: string;
  name: string;
  rol: UserRole;
  company?: string;
}
