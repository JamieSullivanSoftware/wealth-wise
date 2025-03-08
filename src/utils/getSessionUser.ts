import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/configdatabase';
import User from '@/modelsUser';

export const getSessionUser = async () => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.log('No session found');
    return null;
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    console.log('No user found');
    return null;
  }

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    },
  };
};
