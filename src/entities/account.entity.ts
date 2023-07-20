import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MediaEntity } from './media.entity';

@Entity()
export class Account {
    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @OneToMany(() => MediaEntity, media => media.owner) media: MediaEntity[]
}
