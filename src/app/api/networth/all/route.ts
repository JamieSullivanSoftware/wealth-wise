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
          categories: [
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
                userId: userId,
              },
            },
            {
              $group: {
                _id: {
                  $year: '$createdAt',
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
                        unit: 'year',
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
          baseNetworth: { $add: [0, 0] },
          existingData: '$afterStartDateTotals',
          categories: '$categories',
        },
      },

      // Step 3: Create an array of dates after the start date
      {
        $addFields: {
          firstResult: {
            $arrayElemAt: ['$existingData', 0],
          },
        },
      },

      // Step 3: Create an array of dates after the start date
      {
        $addFields: {
          dateArray: {
            $map: {
              input: {
                $range: [
                  0,
                  {
                    $add: [
                      {
                        $dateDiff: {
                          startDate: { $toDate: '$firstResult.date' },
                          endDate: today,
                          unit: 'year',
                        },
                      },
                      1, // Ensure the current year is included
                    ],
                  },
                  1,
                ],
              },
              as: 'yearOffset',
              in: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: {
                    $dateTrunc: {
                      date: {
                        $dateAdd: {
                          startDate: { $toDate: '$firstResult.date' },
                          unit: 'year',
                          amount: '$$yearOffset',
                        },
                      },
                      unit: 'year',
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
