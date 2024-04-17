import { openings } from '../opening';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux'; // Ensure correct path
import { getAllVariationsByOpeningKey } from '../opening';

// Selector to get completed variations for all openings
const getCompletedVariations = state => state.progress.completedVariations;

// Selector to get completed variations and the opening name for a specific opening key
export const getCompletedVariationsAndOpeningName = createSelector(
  [getCompletedVariations, (_, openingKey) => openingKey],
  (completedVariations, openingKey) => {
    const opening = openings.find(({ key }) => key === openingKey);

    if (!opening) {
      return { openingName: '', completedVariations: [] };
    }

    const completedVariationsInfo = opening.variations
      .filter(
        v =>
          completedVariations[openingKey] &&
          completedVariations[openingKey][v.key],
      )
      .map(v => ({ key: v.key, name: v.name }));

    return {
      openingName: opening.name,
      completedVariations: completedVariationsInfo,
    };
  },
);

export const useCurrentOpeningKey = () =>
  useSelector(state => state.currentPlay.selectedOpening);

// React hooks to access current play information from state
export const useCurrentOpening = () =>
  useSelector(state => state.currentPlay.selectedOpening);

export const usePlayerPlayingAs = () =>
  useSelector(state => state.currentPlay.playerPlayingAs);

export const useCurrentVariation = () =>
  useSelector(state => state.currentPlay.variationKey);

export const useCurrentVariationCompleted = () =>
  useSelector(state => state.currentPlay.variationCompleted);

export const useCurrentOpeningCompleted = () =>
  useSelector(state => state.currentPlay.openingCompleted);

export const useCurrentMoveIndex = () =>
  useSelector(state => state.currentPlay.moveIndex);

export const useWhoseTurn = () =>
  useSelector(state => state.currentPlay.whoseTurn);

export const useAllVariationsInOpening = currentOpeningKey =>
  useSelector(state =>
    getAllVariationsByOpeningKey(state.currentPlay.selectedOpening),
  );

export const useCompletedVariationsInOpening = currentOpeningKey =>
  useSelector(
    state =>
      state.progress.completedVariations[state.currentPlay.selectedOpening],
  );
