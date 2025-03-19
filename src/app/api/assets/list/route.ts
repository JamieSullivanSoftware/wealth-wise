import type { PipelineStage } from 'mongoose';

import connectDB from '@/config/database';
import Asset from '@/models/Asset';
import { getSessionUser } from '@/utils/getSessionUser';

export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    let userId = process.env.DEFAULT_USER_ID;

    if (sessionUser && sessionUser.userId) {
      userId = sessionUser.userId;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          user_id: userId,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
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
