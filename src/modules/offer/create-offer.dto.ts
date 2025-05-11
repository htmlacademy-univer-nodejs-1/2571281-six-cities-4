import {
  IsString, Length, IsEnum, IsUrl, IsBoolean,
  IsNumber, Min, Max, IsInt, ArrayMinSize, ArrayMaxSize,
  IsArray, ValidateNested, IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';
import { City, Good, HousingType } from './offer.enum.js';

class CoordinatesDto {
  @IsNumber() public latitude!: number;
  @IsNumber() public longitude!: number;
}

export class CreateOfferDto {
  @IsString()
  @Length(10, 100)
  public title!: string;

  @IsString()
  @Length(20, 1024)
  public description!: string;

  @IsEnum(City)
  public city!: City;

  @IsUrl()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsUrl({}, { each: true })
  public images!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating!: number;

  @IsEnum(HousingType)
  public type!: HousingType;

  @IsInt() @Min(1) @Max(8) public bedrooms!: number;
  @IsInt() @Min(1) @Max(10) public maxAdults!: number;
  @IsInt() @Min(100) @Max(100_000) public price!: number;

  @IsArray()
  @IsEnum(Good, { each: true })
  public goods!: Good[];

  @IsMongoId()
  public hostId!: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates!: CoordinatesDto;
}
