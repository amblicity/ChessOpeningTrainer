const initialProgressState = {
  completedVariations: {
    QueensGambitAccepted: [],
    KingsIndianDefense: [],
    RuyLopez: [],
    CaroKann: [],
    // all others from json...
  },
};

export const progressReducer = (state = initialProgressState, action) => {
  switch (action.type) {
    case 'progress/addCompletedVariation': {
      const { selectedOpening, variationKey } = action.payload;
      console.log('actionpayload:', action.payload);
      const completedVariationsInOpening = [
        ...state.completedVariations[selectedOpening],
      ];

      // Check if the line is already completed to avoid duplicates
      if (!completedVariationsInOpening.includes(variationKey)) {
        completedVariationsInOpening.push(variationKey);
      }

      return {
        ...state,
        completedVariations: {
          ...state.completedVariations,
          [selectedOpening]: completedVariationsInOpening,
        },
      };
    }

    case 'progress/reset': {
      return initialProgressState;
    }

    default:
      return state;
  }
};
