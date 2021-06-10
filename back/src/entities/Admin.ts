import { ChildEntity } from 'typeorm';

import { User } from './User';

/**
 * Classe représentant un administrateur dans la base de donnée.
 *
 */
@ChildEntity()
export class Admin extends User { }
