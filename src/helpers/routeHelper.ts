export const generateCumulatedNetworth = (
  dateArrayField: string,
  existingDataField: string,
  baseNetworthField: string
) => [
  // Step 4: Iterate date array and existing data, assigning matches or 0 if no match found
  {
    $addFields: {
      results: {
        $map: {
          input: `$${dateArrayField}`,
          as: 'date',
          in: {
            date: '$$date',
            diff: {
              $reduce: {
                input: `$${existingDataField}`,
                initialValue: { total: 0 },
                in: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: `$${existingDataField}`,
                              as: 'existing',
                              cond: { $eq: ['$$existing.date', '$$date'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { total: { $ifNull: ['$$match.total', 0] } },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // Step 5: Calculate cumulative totals for each date
  {
    $addFields: {
      cumulatedTotals: {
        $reduce: {
          input: '$results',
          initialValue: { newTotal: null, totalsArray: [] },
          in: {
            $cond: {
              if: { $eq: ['$$value.newTotal', null] },
              then: {
                newTotal: {
                  $add: ['$$this.diff.total', `$${baseNetworthField}`],
                },
                totalsArray: {
                  $concatArrays: [
                    '$$value.totalsArray',
                    [
                      {
                        date: '$$this.date',
                        total: {
                          $add: ['$$this.diff.total', `$${baseNetworthField}`],
                        },
                      },
                    ],
                  ],
                },
              },
              else: {
                $let: {
                  vars: {
                    cumulatedTotal: {
                      $add: ['$$value.newTotal', '$$this.diff.total'],
                    },
                  },
                  in: {
                    newTotal: '$$cumulatedTotal',
                    totalsArray: {
                      $concatArrays: [
                        '$$value.totalsArray',
                        [{ date: '$$this.date', total: '$$cumulatedTotal' }],
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // Step 6: Extract final new total and diff total
  {
    $addFields: {
      newTotal: {
        $arrayElemAt: [
          '$cumulatedTotals.totalsArray',
          { $subtract: [{ $size: '$cumulatedTotals.totalsArray' }, 1] },
        ],
      },
    },
  },
  {
    $addFields: {
      diffTotal: {
        $round: [
          { $subtract: ['$newTotal.total', `$${baseNetworthField}`] },
          2,
        ],
      },
    },
  },

  // Step 7: Simplify data and map date and total to results
  {
    $project: {
      diffTotal: 1,
      diffPercentage: {
        $round: [
          {
            $multiply: [
              {
                $cond: {
                  if: { $eq: [`$${baseNetworthField}`, 0] }, // Check if baseNetworthField is zero
                  then: 0, // If zero, return 0 to avoid division error
                  else: {
                    $divide: ['$diffTotal', `$${baseNetworthField}`],
                  },
                },
              },
              100,
            ],
          },
          2,
        ],
      },
      categories: '$categories',
      results: {
        $map: {
          input: '$cumulatedTotals.totalsArray',
          as: 'result',
          in: {
            date: '$$result.date',
            total: { $round: ['$$result.total', 2] },
          },
        },
      },
    },
  },
];

export const formatCategories = () => [
  { $sort: { _id: 1 as 1 | -1 } },
  {
    $project: {
      _id: 0,
      name: '$_id',
      total: { $round: ['$total', 2] },
    },
  },
];
