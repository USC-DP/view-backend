import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn("uuid")
  mediaId: string;

  @Column()
  mediaType: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  path: string;

  @Column()
  lat: number;

  @Column()
  lon: number;

  @Column()
  dateTaken: string;

  @CreateDateColumn()
  fileCreatedAt: string;

  @UpdateDateColumn()
  fileLastModified: string;

  @Column()
  description: string;

  @ManyToOne(() => Account, owner => owner.media)
  @JoinColumn({name: 'ownerId'})
  owner: Account;

}
