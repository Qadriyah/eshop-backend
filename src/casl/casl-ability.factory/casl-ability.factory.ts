import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { USER_TYPES } from '@app/common';
import { Sale } from '../../sales/entities/sale.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Message } from '../../messages/entities/message.entity';
import { Product } from '../../product/entities/product.entity';
import { User, UserDocument } from '../../users/entities/user.entity';

type Subjects = InferSubjects<
  | Sale
  | Profile
  | User
  | Message
  | Product
  | 'Sale'
  | 'Profile'
  | 'User'
  | 'Message'
  | 'Product'
  | 'all'
>;
type AppAbilities = [
  'manage' | 'create' | 'read' | 'update' | 'delete' | 'all',
  Subjects,
];

export type AppAbility = MongoAbility<AppAbilities>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDocument) {
    const { can, cannot, rules } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );
    if (user.roles.includes(USER_TYPES.admin)) {
      can('manage', 'all');
    } else {
      can('read', 'all');
      cannot('update', 'Product');
    }

    cannot('update', 'Sale', { user: { $ne: user.id } });
    cannot('update', 'Profile', { user: { $ne: user.id } });
    cannot('delete', 'all');

    return createMongoAbility(rules);
  }
}
