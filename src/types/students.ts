export interface StudentType {
  id: number;
  name: string;
  nis: string;
  class: string;
  class_id: number;
  point: number;
  year_period: number;
}

export interface PromoteStudentsPayload {
  nis: string[];
  class_id_to: number;
}
