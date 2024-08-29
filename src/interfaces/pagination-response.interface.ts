export interface PaginationResponseInterface<T> {
  page: number
  perPage: number
  count: number
  records: T[]
}
