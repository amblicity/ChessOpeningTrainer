import React, { createContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  currentScenario: null,
  completedLinesPerScenario: {},
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCENARIO':
      return { ...state, currentScenario: action.payload };

    case 'COMPLETE_LINE':
      const { scenario, line } = action.payload;
      const newCompletedLines = new Set(
        state.completedLinesPerScenario[scenario] || [],
      );
      newCompletedLines.add(line);
      console.log(newCompletedLines);
      return {
        ...state,
        completedLinesPerScenario: {
          ...state.completedLinesPerScenario,
          [scenario]: newCompletedLines,
        },
      };

    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
