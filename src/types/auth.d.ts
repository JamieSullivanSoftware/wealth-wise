import type { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';

declare type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

declare interface ISessionUser {
  email: string;
  name?: string;
  image?: string;
  id?: string;
}
