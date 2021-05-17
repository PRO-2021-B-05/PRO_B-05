import {CollectionOf, Default, Description, Generics, Integer, Min} from "@tsed/schema";

@Generics('T')
export class Pagination<T> {
    @Integer()
    @Min(0)
    @Default(0)
    offset: number = 0;

    @Integer()
    @Min(1)
    @Default(20)
    limit: number = 20;


    @CollectionOf('T')
    results: T[]

    @Integer()
    @Min(0)
    @Default(0)
    total: number = 0;

    constructor({results, offset, limit, total}: Partial<Pagination<T>>) {
        results && (this.results = results);
        offset && (this.offset = offset);
        limit && (this.limit = limit);
        total && (this.total = total);
    }

}