import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Media } from './media.entity';

@Entity()
export class Account {
    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @OneToMany(() => Media, media => media.owner) media: Media[]
}
