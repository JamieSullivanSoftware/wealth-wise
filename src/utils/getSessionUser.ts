import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

import type { ISessionUser } from '@/types/auth';

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return null;
    }

    const sessionUser = session?.user as ISessionUser;

    return {
      user: sessionUser,
      userId: sessionUser.id,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
