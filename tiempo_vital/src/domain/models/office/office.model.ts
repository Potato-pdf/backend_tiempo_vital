import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

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

    @Column({ nullable: true, type: 'text' })
    image!: string;

    @Column()
    userId!: string;

    @ManyToOne("User", "offices")
    user!: any;
}