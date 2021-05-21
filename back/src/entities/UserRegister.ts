import {MaxLength, MinLength, Pattern, Required} from '@tsed/schema';

export class UserRegister {
  @Pattern(/^[a-zA-Z0-9_-]{3,15}$/)
  @MinLength(3)
  @MaxLength(15)
  @Required()
  username: string;

  @MinLength(8)
  @Required()
  password: string;

  @Required()
  firstname: string;

  @Required()
  lastname: string;
}
