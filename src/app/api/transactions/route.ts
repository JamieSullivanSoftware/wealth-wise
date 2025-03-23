import type { NextRequest } from 'next/server';
import { Types, type PipelineStage } from 'mongoose';

import connectDB from '../../../../config/database';
import Transaction from '../../../../models/Transaction';
import { getSessionUser } from '@/utils/getSessionUser';

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
          transactions: [
            {
              $match: {
                user_id: userId,
              },
            },
            {
              $addFields: {
                asset_id: { $toObjectId: '$asset_id' },
              },
            },
            {
              $lookup: {
                from: 'assets',
                localField: 'asset_id',
                foreignField: '_id',
                as: 'asset',
              },
            },
            {
              $unwind: '$asset',
            },
            {
              $project: {
                _id: 1,
                user_id: 1,
                updatedAt: 1,
                amount: 1,
                numShares: 1,
                type: 1,
                'asset._id': 1,
                'asset.name': 1,
                'asset.category': 1,
                updatedAssetCost: 1,
              },
            },
            {
              $sort: {
                ...(sortBy === 'assetName' ? { 'asset.name': order } : {}),
                ...(sortBy === 'assetCategory'
                  ? { 'asset.category': order }
                  : {}),
                ...(sortBy === 'updatedAssetCost'
                  ? { updatedAssetCost: order }
                  : {}),
                ...(sortBy !== 'assetName' && sortBy !== 'assetCategory'
                  ? { [sortBy]: order }
                  : {}),
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
          transactions: 1,
          count: { $arrayElemAt: ['$count.count', 0] },
        },
      },
    ];

    // Extract data from the aggregation pipeline
    const data = await Transaction.aggregate(pipeline).exec();
    const transactions = data[0].transactions;
    const totalCount = data[0].count;
    const totalPages = Math.ceil(totalCount / limit);
    const emptyDataResponse = {
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      transactions: [],
    };

    // Check if the page number is valid
    if (page < 1 || page > totalPages) {
      console.log('Invalid page number');
      return new Response(JSON.stringify(emptyDataResponse), {
        status: 400,
      });
    }

    // Check for empty data
    if (transactions.length === 0) {
      console.log('No transactions found');
      return new Response(JSON.stringify(emptyDataResponse), {
        status: 200,
      });
    }

    return new Response(
      JSON.stringify({
        totalCount,
        totalPages,
        currentPage: page,
        transactions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
