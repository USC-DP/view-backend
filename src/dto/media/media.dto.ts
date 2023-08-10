import { ArrayMaxSize, IsArray, IsDate, IsDateString, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class MediaDto {

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsInt()
    width: number;

    @IsNotEmpty()
    @IsInt()
    height: number;

    @IsNotEmpty()
    @IsString()
    ownerId: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsLatitude()
    lat: number;

    @IsNotEmpty()
    @IsLongitude()
    lon: number;

    @IsNotEmpty()
    @IsDateString()
    dateTaken: string;

    /*@IsOptional()
    @IsArray()
    @ArrayMaxSize(512)
    @IsNumber({}, { each: true })
    clipEmbeddings?: Number[]*/
}