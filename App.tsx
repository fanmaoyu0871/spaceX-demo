import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {RootStackParamList, RootStackScreenProps} from './navigation-types';

import LauchList from './src/pages/LauchList';
import LauchDetail from './src/pages/LauchDetail';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};



const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  return (
      <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="LauchList">
              <Stack.Screen
                  name="LauchList"
                  component={LauchList}
                  options={{headerShown:false}}
              />
              <Stack.Screen name="LauchDetail" component={LauchDetail} />
            </Stack.Navigator>
          </NavigationContainer>
      </PaperProvider>
  );
}
