import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../users/user.model";


@Entity()
export class Office {
    @PrimaryColumn({ unique: true, readonly: true })
    id!: string;

    @Column()
    name!: string;

    @Column()
    address!: string;

    @ManyToOne(() => User, (User) => User.offices)
    user!: User;

}