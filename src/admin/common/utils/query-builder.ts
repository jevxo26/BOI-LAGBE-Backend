import {
  Between,
  FindManyOptions,
  FindOptionsOrder,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  PaginatedQueryDto,
} from '../dto/paginated-query.dto';
import { DateRangeQueryDto } from '../dto/date-range-query.dto';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface QueryBuilderOptions {
  pagination?: PaginatedQueryDto;
  dateRange?: DateRangeQueryDto;
  // Falls back to pagination.search when not provided explicitly
  search?: string;
  searchableFields?: string[];
  // Plain column names only (relation dot-paths like 'profile.fullName' are not supported)
  sortableFields?: string[];
  dateField?: string;
  where?: Record<string, unknown> | Record<string, unknown>[];
}

// Shared helper for admin list endpoints: builds TypeORM find options from the
// shared query DTOs and composes a pagination meta object for the response.
//
// Example usage inside an admin service:
//   const options = QueryBuilder.buildQueryOptions({
//     pagination: query,
//     dateRange: query,
//     searchableFields: ['fullName', 'email', 'phone', 'userCode'],
//     sortableFields: ['createdAt', 'fullName', 'status'],
//     dateField: 'createdAt',
//   });
//   const [items, total] = await this.userRepository.findAndCount(options);
//   return { items, meta: QueryBuilder.buildMeta(query, total) };
export class QueryBuilder {
  private static readonly DEFAULT_SORT_FIELD = 'createdAt';
  private static readonly FALLBACK_SORT_FIELDS = ['createdAt', 'updatedAt'];
  private static readonly SEARCH_MAX_LENGTH = 100;

  static buildQueryOptions(
    options: QueryBuilderOptions,
  ): FindManyOptions<unknown> {
    const { skip, take } = this.buildPagination(options.pagination);
    const order = this.buildSort(options.pagination, options.sortableFields);
    const where = this.buildWhere(options);

    return {
      skip,
      take,
      order,
      ...(where ? { where } : {}),
    };
  }

  static buildPagination(query?: PaginatedQueryDto): {
    skip: number;
    take: number;
  } {
    const page = Math.max(query?.page ?? DEFAULT_PAGE, DEFAULT_PAGE);
    const limit = Math.min(query?.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    return { skip: (page - 1) * limit, take: limit };
  }

  static buildSort(
    query?: PaginatedQueryDto,
    sortableFields?: string[],
  ): FindOptionsOrder<unknown> {
    const sortBy = query?.sortBy?.trim() || this.DEFAULT_SORT_FIELD;
    const allowedFields = sortableFields?.length
      ? sortableFields
      : this.FALLBACK_SORT_FIELDS;
    const field = allowedFields.includes(sortBy)
      ? sortBy
      : this.DEFAULT_SORT_FIELD;
    const sortOrder = query?.sortOrder ?? 'DESC';

    return { [field]: sortOrder };
  }

  static buildMeta(query: PaginatedQueryDto, total: number): PaginationMeta {
    const page = Math.max(query?.page ?? DEFAULT_PAGE, DEFAULT_PAGE);
    const limit = Math.min(query?.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  private static buildWhere(
    options: QueryBuilderOptions,
  ): Record<string, unknown> | Record<string, unknown>[] | undefined {
    const baseFilters: Record<string, unknown>[] = [];
    if (options.where) {
      const fragments = Array.isArray(options.where)
        ? options.where
        : [options.where];
      for (const fragment of fragments) {
        baseFilters.push(fragment);
      }
    }
    baseFilters.push(
      ...this.buildDateRangeWhere(options.dateRange, options.dateField),
    );

    const searchFilters = this.buildSearchWhere(
      options.search ?? options.pagination?.search,
      options.searchableFields,
    );

    const combined = this.combineWhere(baseFilters, searchFilters);
    if (combined.length === 0) return undefined;
    return combined.length === 1 ? combined[0] : combined;
  }

  private static buildSearchWhere(
    search?: string,
    searchableFields?: string[],
  ): Record<string, unknown>[] {
    const term = search?.trim();
    if (!term || !searchableFields?.length) return [];

    // Guard against overly long / abusive search terms
    const safeTerm = term.slice(0, this.SEARCH_MAX_LENGTH);
    const escapedTerm = this.escapeLike(safeTerm);

    // Each field becomes one OR branch inside the WHERE clause
    return searchableFields.map((field) => ({
      [field]: ILike(`%${escapedTerm}%`),
    }));
  }

  private static buildDateRangeWhere(
    dateRange?: DateRangeQueryDto,
    dateField?: string,
  ): Record<string, unknown>[] {
    if (
      !dateRange ||
      !dateField ||
      (!dateRange.fromDate && !dateRange.toDate)
    ) {
      return [];
    }

    const { fromDate, toDate } = dateRange;
    const where: Record<string, unknown> = {};
    if (fromDate && toDate) {
      where[dateField] = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where[dateField] = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where[dateField] = LessThanOrEqual(new Date(toDate));
    }

    return [where];
  }

  // Combines independent WHERE fragments into Disjunctive Normal Form so base
  // filters AND search alternatives are preserved, e.g.
  // base = [B], search = [S1, S2] => [{ ...B, ...S1 }, { ...B, ...S2 }]
  private static combineWhere(
    base: Record<string, unknown>[],
    search: Record<string, unknown>[],
  ): Record<string, unknown>[] {
    if (base.length === 0) return search;
    if (search.length === 0) return base;

    const combined: Record<string, unknown>[] = [];
    for (const baseFragment of base) {
      for (const searchFragment of search) {
        combined.push({ ...baseFragment, ...searchFragment });
      }
    }
    return combined;
  }

  // Escapes LIKE wildcards so user input like "50% off" or "a_b" matches literally
  private static escapeLike(term: string): string {
    return term.replace(/[\\%_]/g, (char) => `\\${char}`);
  }
}
