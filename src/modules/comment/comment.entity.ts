import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
export class CommentEntity {
  @prop({ required: true, minlength: 5, maxlength: 1024 })
  public text!: string;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, default: Date.now })
  public postDate!: Date;

  @prop({ required: true, ref: () => UserEntity })
  public user!: Ref<UserEntity>;

  @prop({ required: true, ref: () => OfferEntity })
  public offer!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
