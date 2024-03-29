import React from "react";
import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { PaperProvider, Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Themes } from "@/styles";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    JetBrainsMono: require("../assets/fonts/JetBrainsMono.ttf"),
    ...MaterialCommunityIcons.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
};

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={colorScheme === "light" ? Themes.light : Themes.dark}>
      <Stack
        screenOptions={{
          animation: "ios",
          header: (props) => {
            const title = getHeaderTitle(props.options, props.route.name);

            return (
              <Appbar.Header>
                {props.back ? (
                  <Appbar.BackAction onPress={props.navigation.goBack} />
                ) : null}
                <Appbar.Content title={title} />
              </Appbar.Header>
            );
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ title: "Modal", presentation: "modal" }}
        />
      </Stack>
    </PaperProvider>
  );
};

export default RootLayout;
