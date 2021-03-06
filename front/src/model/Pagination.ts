/**
 * interface pour la pagination
 */
export interface Pagination<T> {
  results: T[];
  total: number;
  offset: number;
  limit: number;
}
