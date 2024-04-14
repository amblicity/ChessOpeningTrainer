import { createSelector } from 'reselect';

/**
 * Memoized selector to get the names of all completed variations for a given opening key.
 * Uses createSelector from reselect to ensure memoization.
 * @param {Object} state The entire Redux state.
 * @param {String} openingKey The key of the opening to inspect.
 * @returns {String[]} An array of names of completed variations.
 */
export const getCompletedVariationsByOpeningKey = createSelector(
  [state => state.db.openings, (state, openingKey) => openingKey],
  (openings, openingKey) => {
    const opening = openings.find(o => o.key === openingKey);
    return opening
      ? opening.variations.filter(v => v.completed).map(v => v.name)
      : [];
  },
);

/**
 * Selector to get the moves of a specific variation within a specific opening.
 * Uses both openingKey and variationKey to identify the exact variation.
 * @param {Object} state The entire Redux state.
 * @param {String} openingKey The key of the opening where the variation is located.
 * @param {String} variationKey The key of the variation to inspect.
 * @returns {String[]} An array of moves for the specified variation.
 */
export const getMovesByOpeningAndVariationKey = createSelector(
  [
    state => state.db.openings,
    (state, openingKey) => openingKey,
    (state, openingKey, variationKey) => variationKey,
  ],
  (openings, openingKey, variationKey) => {
    const opening = openings.find(o => o.key === openingKey);
    if (opening) {
      const variation = opening.variations.find(v => v.key === variationKey);
      if (variation) {
        return variation.moves;
      }
    }
    return [];
  },
);
