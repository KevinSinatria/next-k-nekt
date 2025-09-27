import { StudentType } from "./students";

export interface ClassType {
  id: number;
  class: string;
}

export interface DetailClass {
  id: number;
  class: string;
  students: StudentType[];
}
