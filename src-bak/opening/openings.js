export const openings = [
  {
    name: 'Italian Opening',
    key: 'Italian',
    information: 'The Italian one',
    initialPlayerColor: 'w',
    variations: [
      {
        name: 'Indian A',
        key: 'IND_A',
        moves: ['e4', 'e5', 'd4', 'd5', 'Nf3'],
        commentary: ['first move', 'sec move', 'third move', 'four'],
      },
      {
        name: 'Indian B',
        key: 'IND_B',
        moves: ['e4', 'e5', 'd4', 'd5', 'Nc3'],
        commentary: ['first move2', 'sec move2', 'third move2', 'four2'],
      },
    ],
  },
  {
    name: 'Caro-Kann Defense',
    key: 'CaroKann',
    information:
      'The Caro-Kann Defense is a common defense against e4, characterized by d4 and c6. It aims for a solid, yet flexible position.',
    initialPlayerColor: 'b',
    variations: [
      {
        name: 'Quick Init-CaroKann',
        key: 'CK_EXC',
        moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5'],
        commentary: ['first move', 'sec move', 'third move', 'four'],
      },
      {
        name: 'Quick Init-CaroKann2',
        key: 'CK_ADV',
        moves: ['e4', 'c6', 'd4', 'd5', 'e5', 'c5'],
        commentary: ['first move2', 'sec move2', 'third move2', 'four2'],
      },
    ],
  },
];
