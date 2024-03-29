/**
 * Utilities
 */

const Utils = {
  checkWinner: (state: number[][], endGame: (winner: boolean) => void) => {
    let foundWinner = false;

    // Checks the rows
    state.forEach((row: number[]) => {
      if (row.every((value) => value === 1)) {
        endGame(true);
        foundWinner = true;
      }
      if (row.every((value) => value === 0)) {
        endGame(false);
        foundWinner = true;
      }
    });

    const diameters: number[][] = [[], []];
    const stateTrans: number[][] = [[], [], []];

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state.length; col++) {
        // Build state trans
        stateTrans[row].push(state[col][row]);

        if (row === col) {
          diameters[0].push(state[row][col]);
          diameters[1].push(state[row][state.length - (col + 1)]);
        }
      }
    }

    // Check the columns
    if (!foundWinner) {
      stateTrans.forEach((row: number[]) => {
        if (row.every((value) => value === 1)) {
          endGame(true);
          foundWinner = true;
        }
        if (row.every((value) => value === 0)) {
          endGame(false);
          foundWinner = true;
        }
      });
    }

    // Checks the diameters
    if (!foundWinner) {
      diameters.forEach((row: number[]) => {
        if (row.every((value) => value === 1)) {
          endGame(true);
        }
        if (row.every((value) => value === 0)) {
          endGame(false);
        }
      });
    }
  },
  resetGame: (callback: (state: number[][]) => void) =>
    callback([
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ]),
  updateCell: (
    state: number[][],
    index: { row: number; col: number },
    newVal: number,
    callback: (result: number[][]) => void,
  ) => {
    const result = state;

    result[index.row][index.col] = newVal;

    callback(result);
  },
  play: (
    state: number[][],
    callback: (index: { row: number; col: number }, newVal: number) => void,
  ) => {
    let breakOuterFor = false;

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state.length; col++) {
        if (
          row * col === 4 ||
          (state[row][col] === -1 && Math.random() > 0.5)
        ) {
          callback({ row: row, col: col }, 1);

          breakOuterFor = true;
          break;
        }
      }
      if (breakOuterFor) {
        break;
      }
    }
  },
  endGam: (
    winner: boolean,
    updateWinner: (winner?: boolean) => void,
    score: number,
    updateScore: (score: number) => void,
    callback: () => void,
  ) => {
    updateWinner(winner);

    if (!winner) {
      updateScore(score + 100);
    }

    callback();

    setTimeout(() => {
      updateWinner(undefined);
    }, 2000);
  },
};

export { Utils };
