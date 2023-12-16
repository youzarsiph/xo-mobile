import tw from "twrnc";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";

const XO = () => {
  const [score, setScore] = React.useState<number>(0);
  const [turn, setTurn] = React.useState<boolean>(false);
  const [winner, setWinner] = React.useState<undefined | boolean>(undefined);
  const [state, setState] = React.useState<number[][]>([
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ]);

  React.useEffect(() => {
    if (turn) {
      setTimeout(() => {
        playXO();
      }, 750);
    }

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, turn]);

  /**
   * Resets the state
   */
  const resetState = () =>
    setState([
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ]);

  /**
   * Updates the state with given value
   * @param row row index
   * @param col col index
   * @param value the new value for state[row][col]
   */
  const updateState = (row: number, col: number, value: number) => {
    // Temporary variables
    const tempState = state;

    // Update temp vars
    tempState[row][col] = value;

    // Update state
    setState(tempState);

    // Change turn
    setTurn(!turn);
  };

  /**
   * Simulates XO game play
   */
  const playXO = () => {
    let breakOuterFor = false;

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state.length; col++) {
        if (
          row * col === 8 ||
          (state[row][col] === -1 && Math.random() > 0.5)
        ) {
          updateState(row, col, 1);

          breakOuterFor = true;
          break;
        }
      }
      if (breakOuterFor) {
        break;
      }
    }
  };

  /**
   * Sets the winner and restarts the game
   * @param winner the winner of the game
   */
  const endGame = (winner: boolean) => {
    setWinner(winner);

    // Update player's score
    if (!winner) {
      setScore(score + 100);
    }

    resetState();

    // Restart the game
    setTimeout(() => {
      setWinner(undefined);
    }, 2000);
  };

  /**
   * Checks for game end states
   */
  const check = () => {
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

    // Checks the columns
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
  };

  const Alert = () => (
    <View
      role="alert"
      style={tw`mx-8 flex flex-row w-full items-center gap-4 rounded-xl border-2 px-8 py-4 ${
        winner !== undefined
          ? winner
            ? "border-red-700 bg-red-500"
            : "border-green-700 bg-green-500"
          : "border-slate-700 bg-slate-500"
      }`}
    >
      {winner !== undefined ? (
        winner ? (
          <>
            <MaterialIcons name="close" size={32} style={tw`text-white`} />
            <Text style={tw`text-lg text-white`}>Computer is the winner!</Text>
          </>
        ) : (
          <>
            <MaterialIcons
              name="check"
              size={32}
              style={tw`h-8 w-8 text-white`}
            />
            <Text style={tw`text-lg text-white`}>You are the winner!</Text>
          </>
        )
      ) : (
        <>
          <MaterialIcons name="info" size={32} style={tw`h-8 w-8 text-white`} />
          <Text style={tw`text-lg text-white`}>
            {turn ? "Computer's turn" : "The turn is yours!"}
          </Text>
        </>
      )}
    </View>
  );

  const Grid = () => (
    <View
      style={tw`flex gap-8 rounded-3xl p-8 border-2 border-slate-100 bg-white dark:bg-slate-700 dark:border-slate-900`}
    >
      {state.map((row: number[], rowIndex: number) => (
        <View key={`row-${rowIndex}`} style={tw`flex-row items-center gap-8`}>
          {row.map((col: number, colIndex: number) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={`col-${colIndex}`}
              disabled={col === 1 || col === 0}
              onPress={() => updateState(rowIndex, colIndex, 0)}
              style={tw`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${
                col === -1
                  ? "border-slate-100 dark:border-slate-800"
                  : col === 0
                    ? "bg-green-500 border-green-700 dark:border-green-800"
                    : "bg-red-500 border-red-700 dark:border-red-800"
              }`}
            >
              {col === -1 ? undefined : col === 0 ? (
                <MaterialIcons name="check" size={32} style={tw`text-white`} />
              ) : (
                <MaterialIcons name="close" size={32} style={tw`text-white`} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );

  const Buttons = () => (
    <View style={tw`flex w-full items-center justify-between gap-8`}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => resetState()}
        style={tw`flex w-full flex-row items-center justify-center gap-4 rounded-xl bg-red-500 p-4 border-2 border-red-700`}
      >
        <MaterialIcons name="refresh" size={32} style={tw`text-white`} />
        <Text style={tw`font-bold tracking-widest text-white text-xl`}>
          Try Again
        </Text>
      </TouchableOpacity>

      <View
        style={tw`flex flex-row w-full items-center justify-center gap-4 rounded-xl py-4 bg-green-500 border-2 border-green-700 px-8`}
      >
        <MaterialIcons name="score" size={32} style={tw`text-white`} />
        <Text style={tw`font-bold tracking-widest text-white text-xl`}>
          Score: {score}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={tw`flex gap-8 w-full bg-white dark:bg-slate-800`}>
      <View style={tw`flex gap-16 w-full items-center justify-center py-16`}>
        <Text style={tw`text-9xl dark:text-white`}>XO</Text>

        <Text style={tw`text-xl dark:text-white`}>Yousef Abu Shanab</Text>
      </View>

      <View
        style={tw`flex flex-col items-center justify-center gap-16 px-4 py-8`}
      >
        <Alert />

        <Grid />

        <Buttons />
      </View>
    </View>
  );
};

export default XO;
