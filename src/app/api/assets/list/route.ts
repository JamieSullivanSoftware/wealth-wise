import type { PipelineStage } from 'mongoose';

import connectDB from '@/config/database';
import Asset from '@/models/Asset';

export const GET = async () => {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
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
