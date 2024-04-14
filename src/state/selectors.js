import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';

// Basic selectors to fetch data from the state
const getAllOpenings = state => state.db.openings;
const getCompletedVariations = state => state.progress.completedVariations;

// Selector to get completed variations and the opening name for a specific opening key
export const getCompletedVariationsAndOpeningName = createSelector(
  [getAllOpenings, getCompletedVariations, (state, openingKey) => openingKey],
  (openings, completedVariations, openingKey) => {
    const opening = openings.find(o => o.key === openingKey);
    if (!opening) {
      return { openingName: '', completedVariations: [] };
    }
    const completedVariationsInfo = opening.variations
      .filter(
        v =>
          completedVariations[openingKey] &&
          completedVariations[openingKey][v.key] &&
          completedVariations[openingKey][v.key].isCompleted,
      )
      .map(v => ({ key: v.key, name: v.name }));
    return {
      openingName: opening.name,
      completedVariations: completedVariationsInfo,
    };
  },
);

// Selector to get the moves of a specific variation within a specific opening
export const getMovesByOpeningAndVariationKey = createSelector(
  [
    getAllOpenings,
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

// Selector to get all variations of a specific opening identified by its openingKey
export const getAllVariationsByOpeningKey = createSelector(
  [getAllOpenings, (state, openingKey) => openingKey],
  (openings, openingKey) => {
    const opening = openings.find(o => o.key === openingKey);
    if (opening) {
      return opening.variations.map(variation => ({
        name: variation.name,
        key: variation.key,
      }));
    }
    return [];
  },
);

// React hooks to access current play information from state
export const useCurrentOpening = () =>
  useSelector(state => state.currentPlay.selectedOpening);

export const usePlayingAs = () =>
  useSelector(state => state.currentPlay.playingAs);

export const useCurrentVariation = () =>
  useSelector(state => state.currentPlay.variationKey);

export const useCurrentMoveIndex = () =>
  useSelector(state => state.currentPlay.moveIndex);
