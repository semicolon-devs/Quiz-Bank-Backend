import { Pagination } from "./pagination.interface";

export interface Filter extends Pagination {
  subject?: string;
  subCategory?: string;
  module?: string;
}
