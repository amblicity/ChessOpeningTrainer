const initialDbState = {
  openings: [],
};

export const dbReducer = (state = initialDbState, action) => {
  switch (action.type) {
    case 'db/setOpenings': {
      return {
        ...state,
        openings: action.payload,
      };
    }

    case 'db/setVariationAsCompleted': {
      console.log('actionpayload:', action);
      const { variationKey } = action.payload;
      // Create a new state with updated openings
      const updatedOpenings = state.openings.map(opening => ({
        ...opening,
        variations: opening.variations.map(variation => {
          if (variation.key === variationKey) {
            // Return a new variation object with 'completed' set to true
            return { ...variation, completed: true };
          }
          return variation;
        }),
      }));

      return {
        ...state,
        openings: updatedOpenings,
      };
    }
    default:
      return state;
  }
};
