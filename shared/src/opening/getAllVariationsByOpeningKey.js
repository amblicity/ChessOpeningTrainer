import { openings } from './openings';

export const getAllVariationsByOpeningKey = openingKey => {
  const opening = openings.find(({ key }) => key === openingKey);
  return (
    opening?.variations.map(variation => ({
      name: variation.name,
      key: variation.key,
    })) || []
  );
};
