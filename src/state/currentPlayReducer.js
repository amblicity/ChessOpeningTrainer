const initialCurrentPlayState = {
  selectedOpening: '',
  startingPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  playingAs: '',
  remainingVariations: [],
  variationKey: '',
  moveIndex: 0,
};

export const currentPlayReducer = (state = initialCurrentPlayState, action) => {
  switch (action.type) {
    case 'currentPlay/setSelectedOpening': {
      return {
        ...state,
        selectedOpening: action.payload.opening,
        playingAs: action.payload.playingAs,
      };
    }
    case 'currentPlay/setVariation': {
      return {
        ...state,
        variationKey: action.payload.variationKey,
        moveIndex: action.payload.moveIndex,
      };
    }
    default:
      return state;
  }
};
