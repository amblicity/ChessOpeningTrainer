export const setSelectedOpening = (opening, playingAs) => ({
  type: 'currentPlay/setSelectedOpening',
  payload: { opening, playingAs },
});

export const setCurrentVariationAndMoveIndex = (variationKey, moveIndex) => ({
  type: 'currentPlay/setVariationAndMoveIndex',
  payload: { variationKey, moveIndex },
});

export const setVariationAsCompleted = (variationKey, openingKey) => ({
  type: 'progress/setVariationAsCompleted',
  payload: { variationKey, openingKey },
});
