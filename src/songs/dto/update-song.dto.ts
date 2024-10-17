import {
    IsArray,
    IsDateString,
    IsMilitaryTime,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class UpdateSongDto {
    @IsString()
    @IsOptional()
    readonly title;

    @IsOptional()
    @IsArray()
    // @IsString({each: true})
    @IsNumber({}, {each: true})
    readonly artists;

    @IsDateString()
    @IsOptional()
    readonly releasedDate: Date;

    @IsMilitaryTime()
    @IsOptional()
    readonly duration: Date;

    @IsString()
    @IsOptional()
    readonly lyrics: string;

    // Make all these fields optional, as it depends on the user which record they want to
    // update. Use the @IsOptional() decorator for each field to indicate this.


}
    
