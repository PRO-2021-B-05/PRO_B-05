import {User} from "./User";
import {ChildEntity, Column, Entity} from "typeorm";

@ChildEntity()
export class Admin extends User{
}