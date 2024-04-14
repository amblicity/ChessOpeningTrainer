const initialCurrentPlayState = {
  startingPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  selectedOpening: '',
  playingAs: '',
  variationKey: '',
  moveIndex: 0,
};

// Helper functions
function setSelectedOpening(state, action) {
  return {
    ...state,
    selectedOpening: action.payload.opening,
    playingAs: action.payload.playingAs,
  };
}

function setVariation(state, action) {
  return {
    ...state,
    variationKey: action.payload.variationKey,
    moveIndex: action.payload.moveIndex,
  };
}

export const currentPlayReducer = (state = initialCurrentPlayState, action) => {
  switch (action.type) {
    case 'currentPlay/setSelectedOpening':
      return setSelectedOpening(state, action);
    case 'currentPlay/setVariationAndMoveIndex':
      return setVariation(state, action);
    default:
      return state;
  }
};
