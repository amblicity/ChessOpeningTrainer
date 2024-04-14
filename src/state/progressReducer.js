import openingData from '../data/openingdb.json'; // Adjust the path as needed

const initialProgressState = {
  completedVariations: {},
};

// Helper function to initialize state for new openings
function initializeVariationsForOpenings(openingKeys) {
  return openingKeys.reduce((acc, key) => {
    // Find the full opening data by key
    const opening = openingData.openings.find(o => o.key === key);

    // Initialize variations if the opening is found
    if (opening) {
      acc[key] = opening.variations.reduce((varAcc, variation) => {
        varAcc[variation.key] = {
          isCompleted: false,
          completionCount: 0,
          firstCompletionDate: -1,
        };
        return varAcc;
      }, {});
    }

    return acc;
  }, {});
}

// Helper function to add a completed variation
function addCompletedVariation(state, openingKey, variationKey) {
  const newState = { ...state.completedVariations };
  const openingVariations = newState[openingKey] || {};
  const updatedVariation = {
    ...openingVariations[variationKey],
    firstCompletionDate: new Date(),
    completionCount: state.completedVariations.completionCount + 1,
    isCompleted: true,
  };

  return {
    ...state,
    completedVariations: {
      ...state.completedVariations,
      [openingKey]: {
        ...openingVariations,
        [variationKey]: updatedVariation,
      },
    },
  };
}

export function progressReducer(state = initialProgressState, action) {
  switch (action.type) {
    case 'db/setOpenings':
      const newCompletedVariations = initializeVariationsForOpenings(
        action.payload,
      );
      return {
        ...state,
        completedVariations: newCompletedVariations,
      };
    case 'progress/setVariationAsCompleted':
      const { openingKey, variationKey } = action.payload;
      return addCompletedVariation(state, openingKey, variationKey);
    default:
      return state;
  }
}
