import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Office } from "../office/office.model";


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

    @OneToMany(() => Office, (office) => office.users,{
        cascade: true,
    })
    office!: Office[];
}