export interface StudentType {
  id: number;
  name: string;
  nis: string;
  class: string;
  class_id: number;
  point: number;
  year_period: number;
  audit_point: {
    violation_name: string;
    violation_point: number;
    punishment: string;
    violation_category: string;
    implemented: boolean;
    created_at: string;
  }[];
}

export interface PromoteStudentsPayload {
  nis: string[];
  class_id_to: number;
}
