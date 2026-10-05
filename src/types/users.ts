export interface RoleType {
  id: number;
  name: string;
}

export interface UserType {
  id: number;
  username: string;
  fullname: string;
  nip: string | null;
  created_at: string;
  updated_at: string;
  roles: RoleType[];
  roleIds?: number[];
}

export interface TeacherType {
  id: number;
  username: string;
}
