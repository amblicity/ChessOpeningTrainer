const initialProgressState = {
  completedVariations: {},
};

// Helper function to initialize state for new openings
function initializeVariationsForOpenings(openings) {
  return openings.reduce((acc, opening) => {
    acc[opening.key] = opening.variations.reduce((varAcc, variation) => {
      varAcc[variation.key] = {
        isCompleted: false,
        isCurrentlyPlaying: false,
      };
      return varAcc;
    }, {});
    return acc;
  }, {});
}

// Helper function to add a completed variation
function addCompletedVariation(state, openingKey, variationKey) {
  const newState = { ...state.completedVariations };
  const openingVariations = newState[openingKey] || {};
  const updatedVariation = {
    ...openingVariations[variationKey],
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
    case 'progress/addCompletedVariation':
      const { openingKey, variationKey } = action.payload;
      return addCompletedVariation(state, openingKey, variationKey);
    default:
      return state;
  }
}
