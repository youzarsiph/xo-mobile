import React from "react";
import { useColorScheme } from "react-native";
import {
  Chip,
  FAB,
  IconButton,
  Snackbar,
  Surface,
  Text,
} from "react-native-paper";
import { Utils } from "@/utils";

const Home = () => {
  const theme = useColorScheme();
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
        Utils.play(state, (index, val) =>
          Utils.updateCell(state, index, val, (res) => {
            setState(res);
            setTurn(!turn);
          })
        );
      }, 750);
    }

    Utils.checkWinner(state, (res) =>
      Utils.endGam(
        res,
        (w) => setWinner(w),
        score,
        (s) => setScore(s),
        () => Utils.resetGame((s) => setState(s))
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, turn]);

  return (
    <Surface
      style={{
        flex: 1,
        gap: 16,
        padding: 48,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text variant="displayLarge">XO</Text>

      <Surface elevation={0}>
        {state.map((row: number[], i: number) => (
          <Surface
            elevation={0}
            key={"r-" + i}
            style={{ gap: 16, flexDirection: "row" }}
          >
            {row.map((col: number, j: number) => (
              <IconButton
                size={64}
                key={"c-" + j}
                iconColor={
                  col === 0 ? "#22c55e" : col === 1 ? "#e11d48" : undefined
                }
                icon={
                  col === 0
                    ? "check"
                    : col === 1
                    ? "close"
                    : "checkbox-blank-outline"
                }
                onPress={() =>
                  col === 1 || col === 0
                    ? {}
                    : Utils.updateCell(state, { row: i, col: j }, 0, (res) => {
                        setState(res);
                        setTurn(!turn);
                      })
                }
              />
            ))}
          </Surface>
        ))}
      </Surface>

      <Surface
        elevation={0}
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Chip icon={"scoreboard"}>Score: {score}</Chip>

        <FAB
          mode="flat"
          icon="reload"
          onPress={() => Utils.resetGame((res) => setState(res))}
        />
      </Surface>

      <Snackbar
        visible={true}
        onDismiss={() => {}}
        onIconPress={() => {}}
        icon={
          winner !== undefined ? (winner ? "close" : "check") : "information"
        }
      >
        {winner !== undefined
          ? winner
            ? "Computer is the winner!"
            : "You are the winner!"
          : turn
          ? "Computer's turn"
          : "The turn is yours!"}
      </Snackbar>
    </Surface>
  );
};

export default Home;
