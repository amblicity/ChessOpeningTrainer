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
      const { variationKey } = action.payload;
      const updatedOpenings = state.openings.map(opening => ({
        ...opening,
        variations: opening.variations.map(variation => {
          if (variation.key === variationKey) {
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
