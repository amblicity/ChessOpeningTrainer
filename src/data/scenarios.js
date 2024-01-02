const scenarios = {
  KingsIndianDefense: [
    {
      line: 'Classical Variation',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
    },
    {
      line: 'Averbakh Variation',
      moves: [
        'd4',
        'Nf6',
        'c4',
        'g6',
        'Nc3',
        'Bg7',
        'e4',
        'd6',
        'Be2',
        'O-O',
        'Bg5',
      ],
    },
    {
      line: 'Samisch Variation',
      moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f3'],
    },
  ],
  QueensGambitAccepted: [
    {
      line: 'Main Line',
      moves: ['d4', 'd5', 'e4', 'dxe4', 'c4'],
    },
    {
      line: 'Classical Defense',
      moves: ['d4', 'd5', 'c4', 'dxc4', 'e4'],
    },
    {
      line: 'Classical Defense Pferd',
      moves: ['d4', 'd5', 'c4', 'dxc4', 'Nf3'],
    },
  ],
};

export default scenarios;
