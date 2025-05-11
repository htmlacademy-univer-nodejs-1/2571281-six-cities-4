import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import {
  City,
  HousingType,
  Good,
} from './offer.enum.js';
import { UserEntity } from '../user/user.entity.js';

class Coordinates {
    @prop({ required: true })
  public latitude!: number;

    @prop({ required: true })
    public longitude!: number;
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true
    },
    toObject: {
      transform: (_, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true
    }
  }
})
export class OfferEntity {
    @prop({ required: true, minlength: 10, maxlength: 100 })
  public title!: string;

    @prop({ required: true, minlength: 20, maxlength: 1024 })
    public description!: string;

    @prop({ required: true, default: () => new Date() })
    public postDate!: Date;

    @prop({ required: true, enum: City })
    public city!: City;

    @prop({ required: true })
    public previewImage!: string;

    @prop({ required: true, type: () => [String], default: [], validate: (v: string) => v.length === 6 })
    public images!: string[];

    @prop({ required: true, default: false })
    public isPremium!: boolean;

    @prop({ required: true, default: false })
    public isFavorite!: boolean;

    @prop({ required: true, min: 1, max: 5 })
    public rating!: number;

    @prop({ required: true, enum: HousingType })
    public type!: HousingType;

    @prop({ required: true, min: 1, max: 8 })
    public bedrooms!: number;

    @prop({ required: true, min: 1, max: 10 })
    public maxAdults!: number;

    @prop({ required: true, min: 100, max: 100_000 })
    public price!: number;

    @prop({ required: true, type: () => [String], enum: Good, default: [] })
    public goods!: Good[];

    @prop({ required: true, ref: () => UserEntity })
    public hostId!: Ref<UserEntity>;

    @prop({ default: 0 })
    public commentCount!: number;

    @prop({ required: true, _id: false })
    public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
