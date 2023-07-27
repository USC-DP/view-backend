import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export interface ViewMedia {
    mediaId: string,
    width: number,
    height: number
}

export interface ViewSegment {
    segmentId: string,
    media: ViewMedia[]
}
export interface ViewSection {
    sectionId: string
    totalMedia: number
}


export class MediaCategoryDto {
    @IsNotEmpty()
    @IsString()
    mediaId: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    tags: string[];
}