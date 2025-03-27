import type { NextRequest } from 'next/server';
import { Types, type PipelineStage } from 'mongoose';

import connectDB from '@/config/database';
import Asset from '@/models/Asset';
import { getSessionUser } from '@/utils/getSessionUser';
import { getTransactionsAmountAndShares } from '@/helpers/routeHelper';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    // Check if the user is logged in
    const sessionUser = await getSessionUser();
    const userId =
      sessionUser && sessionUser.userId
        ? new Types.ObjectId(sessionUser.userId)
        : new Types.ObjectId(process.env.DEFAULT_USER_ID);

    // Extract query parameters
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 5;
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'createdAt';
    const order = request.nextUrl.searchParams.get('order') === 'asc' ? 1 : -1;
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $facet: {
          assets: [
            {
              $match: {
                user_id: userId,
              },
            },
            ...getTransactionsAmountAndShares(),
            {
              $addFields: {
                marketValue: {
                  $sum: {
                    $multiply: [
                      { $ifNull: ['$shareValue', 0] },
                      { $ifNull: ['$numShares', 0] },
                    ],
                  },
                },
              },
            },
            {
              $addFields: {
                diffTotal: {
                  $sum: {
                    $subtract: [
                      { $ifNull: ['$marketValue', 0] },
                      { $ifNull: ['$totalCost', 0] },
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 1,
                user_id: 1,
                createdAt: 1,
                name: 1,
                category: 1,
                numShares: 1,
                shareValue: 1,
                totalCost: 1,
                diffTotal: 1,
                marketValue: 1,
                detail: 1,
                diffPercentage: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $cond: {
                            if: {
                              $or: [
                                { $eq: ['$diffTotal', 0] },
                                { $eq: ['$totalCost', 0] },
                                { $not: ['$totalCost'] },
                              ],
                            },
                            then: 0,
                            else: {
                              $divide: ['$diffTotal', '$totalCost'],
                            },
                          },
                        },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              },
            },
            {
              $sort: {
                ...(sortBy === 'diffPercentage'
                  ? { diffPercentage: order }
                  : {}),
                ...{ [sortBy]: order },
                _id: order,
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
          count: [
            {
              $match: {
                user_id: userId,
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          assets: 1,
          count: { $arrayElemAt: ['$count.count', 0] },
        },
      },
    ];

    // Extract data from the aggregation pipeline
    const data = await Asset.aggregate(pipeline).exec();
    const assets = data[0].assets;
    const totalCount = data[0].count;
    const totalPages = Math.ceil(totalCount / limit);
    const emptyDataResponse = {
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      assets: [],
    };

    // Check if the page number is valid
    if (page < 1 || page > totalPages) {
      console.log('Invalid page number');
      return new Response(JSON.stringify(emptyDataResponse), {
        status: 400,
      });
    }

    // Check for empty data
    if (assets.length === 0) {
      console.log('No assets found');
      return new Response(JSON.stringify(emptyDataResponse), {
        status: 200,
      });
    }

    return new Response(
      JSON.stringify({
        totalCount,
        totalPages,
        currentPage: page,
        assets,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
