const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

export const getTransactions = async (
  limit: number = 5,
  sortBy: string = 'updatedAt',
  order: string = 'desc',
  page: number = 1
) => {
  if (!apiDomain) {
    return [];
  }
  const res = await fetch(
    `${apiDomain}/transactions?limit=${limit}&sortBy=${sortBy}&order=${order}&page=${page}`,
    {
      cache: 'no-store',
    }
  );
  const data = await res.json();
  return data;
};

export const getAssets = async (
  limit: number = 5,
  sortBy: string = 'updatedAt',
  order: string = 'desc',
  page: number = 1
) => {
  if (!apiDomain) {
    return [];
  }
  const res = await fetch(
    `${apiDomain}/assets?limit=${limit}&sortBy=${sortBy}&order=${order}&page=${page}`,
    {
      cache: 'no-store',
    }
  );
  const data = await res.json();
  return data;
};

export const getAssetList = async () => {
  if (!apiDomain) {
    return [];
  }
  const res = await fetch(`${apiDomain}/assets/list`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.assetList;
};

export const getNetWorth = async (filter: DateFilter) => {
  if (!apiDomain) {
    return [];
  }
  const res = await fetch(`${apiDomain}/networth/${filter}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.networth;
};
