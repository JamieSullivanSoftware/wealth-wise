import type { PipelineStage } from 'mongoose';

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
  startDate.setFullYear(today.getFullYear() - 1);

  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    let userId = process.env.DEFAULT_USER_ID;

    if (sessionUser && sessionUser.userId) {
      userId = sessionUser.userId;
    }

    const pipeline: PipelineStage[] = [
      // Step 1: Filter documents for the base total before start date and all totals after start date
      {
        $facet: {
          baseNetworth: [
            {
              $match: {
                createdAt: { $lt: startDate },
                user_id: userId,
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
                  $month: '$createdAt',
                },
                date: {
                  $last: '$createdAt',
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
              $sort: {
                date: 1 as 1 | -1,
              },
            },
            {
              $project: {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: {
                      $dateTrunc: {
                        date: '$date',
                        unit: 'month',
                        binSize: 1,
                        startOfWeek: 'Sun',
                      },
                    },
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
            $reverseArray: {
              $map: {
                input: {
                  $range: [
                    0, // Start index (current month)
                    12, // Go back 12 months
                    1, // Step by 1 month
                  ],
                },
                as: 'monthOffset',
                in: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: {
                      $dateTrunc: {
                        date: {
                          $dateSubtract: {
                            startDate: today,
                            unit: 'month',
                            amount: '$$monthOffset',
                          },
                        },
                        unit: 'month',
                      },
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
