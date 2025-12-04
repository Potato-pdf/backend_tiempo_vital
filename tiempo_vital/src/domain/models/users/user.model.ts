import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({ unique: true, readonly: true })
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    rol!: string;

    @OneToMany("Office", "user", {
        cascade: true,
    })
    offices!: any[];
}