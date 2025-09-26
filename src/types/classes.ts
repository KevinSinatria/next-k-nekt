import { StudentType } from "./students";

export interface DetailClass {
  id: number;
  class: string;
  students: StudentType[];
}
