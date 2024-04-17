import { getOpeningByKey } from './getOpeningByKey';

export const getMovesByOpeningAndVariationKey = (openingKey, variationKey) => {
  const opening = getOpeningByKey(openingKey);
  const variation = opening?.variations.find(v => v.key === variationKey);
  return variation ? variation.moves : [];
};
