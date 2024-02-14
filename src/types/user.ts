export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRoles;
  password: string;
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

