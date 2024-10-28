import { Knex } from 'knex';

export default function getEntitiesPaginated(
  qb: Knex.QueryBuilder,
  pageNum?: number,
  pageSize?: number,
) {
  if (pageNum && pageSize) {
    qb.offset((pageNum - 1) * pageSize).limit(pageSize);
  }
  return qb;
}
