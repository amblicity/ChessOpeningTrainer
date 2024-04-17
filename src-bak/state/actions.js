export const setVariationAndMoveIndex = (variationKey, moveIndex) => ({
  type: 'currentPlay/setVariationAndMoveIndex',
  payload: { variationKey, moveIndex },
});

export const resetCurrentPlay = (variationKey, moveIndex) => ({
  type: 'currentPlay/reset',
  payload: {},
});

export const setWhoseTurn = whoseTurn => ({
  type: 'currentPlay/setCurrentWhoseTurn',
  payload: {
    whoseTurn,
  },
});

export const setVariationAsCompleted = (variationKey, openingKey) => ({
  type: 'progress/setVariationAsCompleted',
  payload: { variationKey, openingKey },
});

export const setOpeningAsCompleted = openingKey => ({
  type: 'progress/setOpeningAsCompleted',
  payload: { openingKey },
});
