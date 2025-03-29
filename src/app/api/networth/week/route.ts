import { Types, type PipelineStage } from 'mongoose';

import {
  formatCategories,
  generateCumulatedNetworth,
} from '@/helpers/routeHelper';
import Asset from '@/models/Asset';
import connectDB from '@/configdatabase';
import { getSessionUser } from '@/utils/getSessionUser';

export const GET = async () => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6);
  startDate.setUTCHours(0, 0, 0, 0);

  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    const userId =
      sessionUser && sessionUser.userId
        ? new Types.ObjectId(sessionUser.userId)
        : new Types.ObjectId(process.env.DEFAULT_USER_ID);

    const pipeline: PipelineStage[] = [
      // Step 1: Filter documents for the base total before start date and all totals after start date
      {
        $facet: {
          baseNetworth: [
            {
              $match: {
                createdAt: { $lt: startDate },
                userId: userId,
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $subtract: [
                      { $ifNull: ['$value', 0] },
                      { $ifNull: ['$cost', 0] },
                    ],
                  },
                },
              },
            },
          ],
          categories: [
            {
              $match: {
                createdAt: {
                  $gte: startDate,
                  $lte: today,
                },
              },
            },
            {
              $group: {
                _id: '$category',
                total: {
                  $sum: {
                    $subtract: ['$value', '$cost'],
                  },
                },
              },
            },
            ...formatCategories(),
          ],
          afterStartDateTotals: [
            {
              $match: {
                createdAt: {
                  $gte: startDate,
                  $lte: today,
                },
              },
            },
            {
              $group: {
                _id: {
                  $dayOfWeek: '$createdAt',
                },
                date: {
                  $first: '$createdAt',
                },
                total: {
                  $sum: {
                    $subtract: [
                      { $ifNull: ['$value', 0] },
                      { $ifNull: ['$cost', 0] },
                    ],
                  },
                },
              },
            },
            {
              $project: {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$date',
                  },
                },
                total: '$total',
              },
            },
          ],
        },
      },

      // Step 2: Simplify the filtered data
      {
        $project: {
          baseNetworth: { $arrayElemAt: ['$baseNetworth.total', 0] },
          existingData: '$afterStartDateTotals',
          categories: '$categories',
        },
      },

      // Step 3: Create an array of dates after the start date
      {
        $addFields: {
          dateArray: {
            $map: {
              input: {
                $range: [
                  {
                    $toInt: {
                      $divide: [
                        {
                          $toLong: {
                            $dateSubtract: {
                              startDate: today,
                              unit: 'day',
                              amount: 6,
                            },
                          },
                        },
                        1000,
                      ],
                    },
                  },
                  {
                    $toInt: {
                      $divide: [
                        {
                          $toLong: {
                            $dateAdd: {
                              startDate: today,
                              unit: 'day',
                              amount: 1,
                            },
                          },
                        },
                        1000,
                      ],
                    },
                  },
                  86400,
                ],
              },
              as: 'date',
              in: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: {
                    $toDate: {
                      $multiply: ['$$date', 1000],
                    },
                  },
                },
              },
            },
          },
        },
      },
      ...generateCumulatedNetworth('dateArray', 'existingData', 'baseNetworth'),
    ];

    const data = await Asset.aggregate(pipeline).exec();

    return new Response(JSON.stringify({ networth: data[0] || [] }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
