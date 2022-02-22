export type User = {
  email: string;
  name: string;
  lastName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export interface CreateUserRequest extends User {
  password: string;
}
