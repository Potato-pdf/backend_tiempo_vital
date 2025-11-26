import { Column, Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.model";

@Entity()
export class Office {
    @PrimaryColumn({ unique: true, readonly: true })
    id!: string;
    
    @Column()
    name!: string;

    @Column()
    address!: string;

    @Column()
    city!: string;

    @Column()
    state!: string;

    @Column()
    zipCode!: string;

    @Column()
    userId!: string;

    @ManyToOne(() => User, (user) => user.offices)
    user!: User;

}