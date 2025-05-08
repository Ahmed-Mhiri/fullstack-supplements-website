import { Supplement } from "./supplement.model";

export interface PaginatedResponse {
    content: Supplement[];
    totalPages: number;
    totalElements: number;
  }