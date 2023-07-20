import { IsDate, IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class MediaDto {

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsNumber()
    width: number;

    @IsNotEmpty()
    @IsNumber()
    height: number;

    @IsNotEmpty()
    @IsUUID()
    ownerId: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;

    @IsNotEmpty()
    @IsDateString()
    dateTaken: string;
}