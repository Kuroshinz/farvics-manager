import { ISpecification } from '../../core/Specification';

export interface ExpressionVisitor {
  visitEqual(field: string, value: any): any;
  visitGreaterThan(field: string, value: any): any;
  visitLessThan(field: string, value: any): any;
  visitContains(field: string, value: string): any;
  visitBetween(field: string, min: any, max: any): any;
  visitAnd(specs: any[]): any;
  visitOr(specs: any[]): any;
  visitNot(spec: any): any;
}

export class SupabaseQueryBuilder implements ExpressionVisitor {
  private query: any;

  constructor(queryBuilder: any) {
    this.query = queryBuilder;
  }

  visitEqual(field: string, value: any) { this.query = this.query.eq(field, value); return this; }
  visitGreaterThan(field: string, value: any) { this.query = this.query.gt(field, value); return this; }
  visitLessThan(field: string, value: any) { this.query = this.query.lt(field, value); return this; }
  visitContains(field: string, value: string) { this.query = this.query.ilike(field, "%" + value + "%"); return this; }
  visitBetween(field: string, min: any, max: any) { this.query = this.query.gte(field, min).lte(field, max); return this; }
  
  visitAnd(specs: any[]) { return this; }
  visitOr(specs: any[]) { return this; }
  visitNot(spec: any) { return this; }

  getQuery() { return this.query; }
}

export class SpecificationTranslator {
  static translate(spec: ISpecification<any>, queryBuilder: any): any {
    const builder = new SupabaseQueryBuilder(queryBuilder);
    return builder.getQuery();
  }
}
