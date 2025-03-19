import { toCamelCase } from '@/utils/string';

interface Props {
  name: string;
  total: string;
  colourKey: string;
}

const Category = ({ name, total, colourKey }: Props) => {
  const categoryColors: ICategories = {
    accounts: 'bg-primary',
    cars: 'bg-category-green',
    crypto: 'bg-category-teal',
    other: 'bg-category-red',
    realEstate: 'bg-category-pink',
    stocks: 'bg-category-orange',
  };

  return (
    <div className='grid grid-flow-col auto-cols-max gap-2'>
      <div
        className={`w-2 h-2 rounded-full mt-2 ${categoryColors[toCamelCase(colourKey) as keyof ICategories]}`}
      />
      <div>
        <h5>{name}</h5>
        <div>{total}</div>
      </div>
    </div>
  );
};

export default Category;
