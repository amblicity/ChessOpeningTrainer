// const handlePieceDrop = gestureState => {
//   return;
//   console.log('boardOffset', offset);
//   console.log('gestureState', gestureState);
//   const squareSize = (screenWidth - 39) / 8;
//   console.log('squareSize', squareSize);
//   const offX = 40;
//   const offY = 120;
//   const adjustedTargetX = gestureState.moveX - 32;
//   const adjustedTargetY = gestureState.moveY - 140;
//   const adjustedSourceX = gestureState.x0 - 32;
//   const adjustedSourceY = gestureState.y0 - 140;
//
//   const targetFile = Math.floor(adjustedTargetX / squareSize);
//   const targetRank = 7 - Math.floor(adjustedTargetY / squareSize);
//   const sourceFile = Math.floor(adjustedSourceX / squareSize);
//   console.log('file: adjustedSourceX / squareSize', sourceFile);
//   const sourceRank = 7 - Math.floor(adjustedSourceY / squareSize);
//   console.log('rank: adjustedSourceY / squareSize', 7 - sourceRank);
//
//   const targetSquare = `${COLUMN_NAMES[targetFile]}${targetRank + 1}`;
//   const sourceSquare = `${COLUMN_NAMES[sourceFile]}${sourceRank + 1}`;
//   // alert(sourceSquare + ' to ' + targetSquare);
//   try {
//     console.log('moving, from: ' + sourceSquare + ' to ' + targetSquare);
//     const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }; // Include promotion if needed
//     if (game.move(move)) {
//       // alert('valid move');
//       console.log('Valid move');
//       setGame(new Chess(game.fen()));
//       // Update the game state here
//     } else {
//       // alert('invalid move');
//       game.undo();
//       console.log('Invalid move');
//       // Handle invalid move (e.g., revert piece position)
//     }
//   } catch (e) {
//     // alert(e);
//     return;
//   }
// };
