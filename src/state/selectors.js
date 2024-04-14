import { createSelector } from 'reselect';
import openingJsonData from '../data/openingdb.json';
import { useSelector } from 'react-redux'; // Ensure correct path

// Selector to retrieve all opening keys from the Redux store
const getOpeningKeys = state => state.db.openings;

// Selector to get completed variations for all openings
const getCompletedVariations = state => state.progress.completedVariations;

// This selector retrieves detailed information based on the keys stored in the Redux store
export const getOpeningsWithDetails = createSelector(
  [getOpeningKeys],
  openingKeys => {
    return openingKeys
      .map(key => openingJsonData.openings.find(opening => opening.key === key))
      .filter(opening => opening !== undefined); // Ensure only valid openings are returned
  },
);

// Selector to retrieve a specific opening's details by key
export const getOpeningByKey = createSelector(
  [getOpeningKeys, (_, key) => key],
  (openingKeys, key) => {
    return openingJsonData.openings.find(opening => opening.key === key);
  },
);

// Selector to get the moves of a specific variation within a specific opening
export const getMovesByOpeningAndVariationKey = createSelector(
  [getOpeningByKey, (_, __, variationKey) => variationKey],
  (opening, variationKey) => {
    const variation = opening?.variations.find(v => v.key === variationKey);
    return variation ? variation.moves : [];
  },
);

// Selector to get all variations of a specific opening identified by its openingKey
export const getAllVariationsByOpeningKey = createSelector(
  [getOpeningByKey],
  opening => {
    return opening
      ? opening.variations.map(variation => ({
          name: variation.name,
          key: variation.key,
        }))
      : [];
  },
);

// Selector to get completed variations and the opening name for a specific opening key
export const getCompletedVariationsAndOpeningName = createSelector(
  [getOpeningByKey, getCompletedVariations, (_, openingKey) => openingKey],
  (opening, completedVariations, openingKey) => {
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

// React hooks to access current play information from state
export const useCurrentOpening = () =>
  useSelector(state => state.currentPlay.selectedOpening);

export const usePlayingAs = () =>
  useSelector(state => state.currentPlay.playingAs);

export const useCurrentVariation = () =>
  useSelector(state => state.currentPlay.variationKey);

export const useCurrentMoveIndex = () =>
  useSelector(state => state.currentPlay.moveIndex);
