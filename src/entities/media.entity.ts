import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, BeforeUpdate, BeforeInsert, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';
import { MediaTagEntity } from './mediatag.entity';

@Entity({name: 'Media'})
export class MediaEntity {
  @PrimaryColumn("uuid")
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

  @Column({default: ''})
  description: string;

  @ManyToOne(() => Account, owner => owner.media)
  @JoinColumn({name: 'ownerId'})
  owner: Account;

  @OneToMany(() => MediaTagEntity, tag => tag.forMedia)
  tags: MediaTagEntity[];

  @Column()
  ownerId: string;
}