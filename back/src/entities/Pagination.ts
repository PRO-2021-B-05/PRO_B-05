import { CollectionOf, Default, Generics, Integer, Min } from '@tsed/schema';

/**
 * Classe représentant les paramètres de pagination d'une liste générique
 * renvoyée par le serveur.
 *
 */
@Generics('T')
export class Pagination<T> {
  /**
   * Le numéro du premier élément de la pagination.
   *
   */
  @Integer()
  @Min(0)
  @Default(0)
  offset = 0;

  /**
   * Le nombre d'élément maximum de la liste dans la pagination.
   *
   */
  @Integer()
  @Min(1)
  @Default(20)
  limit = 20;

  /**
   * Les éléments de la liste appartenant à la pagination.
   *
   */
  @CollectionOf('T')
  results: T[];

  /**
   * Le nombre total d'éléments dans la liste.
   *
   */
  @Integer()
  @Min(0)
  @Default(0)
  total = 0;

  /**
   * Crée un pagination à partir des paramètres donnés.
   *
   * @param param0 Les paramètres de la pagination.
   *
   */
  constructor({ results, offset, limit, total }: Partial<Pagination<T>>) {
    results && (this.results = results);
    offset && (this.offset = offset);
    limit && (this.limit = limit);
    total && (this.total = total);
  }
}
