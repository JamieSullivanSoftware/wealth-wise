import { Types, type PipelineStage } from 'mongoose';

import connectDB from '@/config/database';
import Asset from '@/models/Asset';
import { getSessionUser } from '@/utils/getSessionUser';

export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    const userId =
      sessionUser && sessionUser.userId
        ? new Types.ObjectId(sessionUser.userId)
        : new Types.ObjectId(process.env.DEFAULT_userId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userId,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
        },
      },
    ];

    const assetList = await Asset.aggregate(pipeline).exec();

    return new Response(
      JSON.stringify({
        assetList,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
