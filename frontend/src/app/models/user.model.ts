export interface AuthResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  id: number;
}
