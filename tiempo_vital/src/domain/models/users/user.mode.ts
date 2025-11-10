import { Column, Entity, PrimaryColumn } from "typeorm";


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
}