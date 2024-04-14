import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';

/**
 * Memoized selector to get the names of all completed variations for a given opening key.
 * Uses createSelector from reselect to ensure memoization.
 * @param {Object} state The entire Redux state.
 * @param {String} openingKey The key of the opening to inspect.
 * @returns {String[]} An array of names of completed variations.
 */
export const getCompletedVariationsByOpeningKey = createSelector(
  [
    state => state.db.openings,
    state => state.progress.completedVariations,
    (state, openingKey) => openingKey,
  ],
  (openings, completedVariations, openingKey) => {
    const opening = openings.find(o => o.key === openingKey);
    return opening
      ? opening.variations
          .filter(
            v =>
              completedVariations[openingKey] &&
              completedVariations[openingKey][v.key] &&
              completedVariations[openingKey][v.key].isCompleted,
          )
          .map(v => v.name)
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

/**
 * Selector to get all variations of a specific opening identified by its openingKey.
 * @param {Object} state The entire Redux state.
 * @param {String} openingKey The key of the opening to inspect.
 * @returns {Object[]} An array of variations for the specified opening, including name and key.
 */
export const getAllVariationsByOpeningKey = createSelector(
  [state => state.db.openings, (state, openingKey) => openingKey],
  (openings, openingKey) => {
    // Find the specified opening by its key
    const opening = openings.find(o => o.key === openingKey);
    if (opening) {
      // Return all variations of the found opening, including both name and key
      return opening.variations.map(variation => ({
        name: variation.name,
        key: variation.key,
      }));
    }
    // Return an empty array if no matching opening is found
    return [];
  },
);

/**
 * Currently Playing as selectors
 * @returns {string|any}
 */
export const useCurrentOpening = () =>
  useSelector(state => state.currentPlay.selectedOpening);

export const usePlayingAs = () =>
  useSelector(state => state.currentPlay.playingAs);

export const useCurrentVariation = () =>
  useSelector(state => state.currentPlay.variationKey);

export const useCurrentMoveIndex = () =>
  useSelector(state => state.currentPlay.moveIndex);
