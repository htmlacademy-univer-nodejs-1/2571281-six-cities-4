import { getModelForClass, modelOptions, prop, Ref, index } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

@index({ user: 1, offer: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    collection: 'favorites',
    timestamps: true,
  },
})
export class FavoriteEntity {
  @prop({ required: true, ref: () => UserEntity })
  public user!: Ref<UserEntity>;

  @prop({ required: true, ref: () => OfferEntity })
  public offer!: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
