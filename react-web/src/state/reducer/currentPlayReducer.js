const initialCurrentPlayState = {
  startingPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  selectedOpening: '',
  playerPlayingAs: '',
  whoseTurn: '',
  variationKey: '',
  variationCompleted: false,
  openingCompleted: false,
  moveIndex: 0,
};

function setSelectedOpening(state, action) {
  return {
    ...initialCurrentPlayState,
    selectedOpening: action.payload.opening,
    playerPlayingAs: action.payload.playerPlayingAs,
    whoseTurn: action.payload.playerPlayingAs === 'b' ? 'cpu' : 'player',
  };
}

function setVariationAndMoveIndex(state, action) {
  return {
    ...state,
    variationKey: action.payload.variationKey,
    moveIndex: action.payload.moveIndex,
  };
}

function setCurrentWhoseTurn(state, action) {
  return {
    ...state,
    whoseTurn: action.payload.whoseTurn,
  };
}

function setVariationAsCompleted(state, action) {
  return {
    ...state,
    variationCompleted: true,
  };
}

function setOpeningAsCompleted(state, action) {
  return {
    ...state,
    openingCompleted: true,
  };
}

function resetCurrentPlay(state, action) {
  return {
    ...state,
    whoseTurn: '',
    moveIndex: 0,
    variationKey: '',
    variationCompleted: false,
  };
}

export const currentPlayReducer = (state = initialCurrentPlayState, action) => {
  switch (action.type) {
    case 'currentPlay/reset':
      return resetCurrentPlay(state, action);
    case 'currentPlay/setSelectedOpening':
      return setSelectedOpening(state, action);
    case 'currentPlay/setVariationAndMoveIndex':
      return setVariationAndMoveIndex(state, action);
    case 'currentPlay/setCurrentWhoseTurn':
      return setCurrentWhoseTurn(state, action);
    case 'progress/setVariationAsCompleted':
      return setVariationAsCompleted(state, action);
    case 'progress/setOpeningAsCompleted':
      return setOpeningAsCompleted(state, action);
    default:
      return state;
  }
};
