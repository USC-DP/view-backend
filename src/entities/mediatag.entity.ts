import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MediaEntity } from './media.entity';

@Entity({name: 'MediaTag'})
export class MediaTagEntity {
  @PrimaryGeneratedColumn("uuid")
  mediaTagId: string;

  @Column()
  tag: string;

  @ManyToOne(() => MediaEntity, forMedia => forMedia.tags)
  @JoinColumn({name: 'mediaId'})
  forMedia: MediaEntity;

  @Column()
  mediaId: string;
}