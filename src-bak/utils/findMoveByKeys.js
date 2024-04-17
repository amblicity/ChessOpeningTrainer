import openingData from '../data/openingdb.json';

export const findMoveByKeys = (openingKey, variationKey) => {
  const opening = openingData.openings.find(
    opening => opening.key === openingKey,
  );
  if (!opening) {
    console.log('Opening not found');
    return null;
  }

  const variation = opening.variations.find(
    variation => variation.key === variationKey,
  );
  if (!variation) {
    console.log('Variation not found');
    return null;
  }

  return variation.moves;
};
