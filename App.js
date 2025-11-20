import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import TabNavigator from "./src/navigation/TabNavigator";
import TrilhaDetalheScreen from "./src/screens/TrilhaDetalheScreen";
import TrilhasScreen from "./src/screens/TrilhasScreen";
import CursosScreen from './src/screens/CursosScreen';
import ProgressoScreen from './src/screens/ProgressoScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AutoavaliacaoScreen from './src/screens/AutoavaliacaoScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen 
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        {/* Telas futuras */}
         <Stack.Screen  name="Login" component={LoginScreen} options={{ headerShown: false }}
/>
          

          <Stack.Screen name="Tabs"component={TabNavigator}options={{ headerShown: false }}
/>

          
        
          <Stack.Screen name="TrilhaDetalhe" component={TrilhaDetalheScreen} options={{
    title: "Detalhes",
    headerStyle: {
      backgroundColor: "#D4F7A1",   
    },
    headerTintColor: "#020202ff",        
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 18,
    },
    headerBackTitleVisible: false,  // remove o texto "Voltar"
  }} />

          <Stack.Screen name="Cursos" component={CursosScreen} />
          <Stack.Screen name="Progresso" component={ProgressoScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} /> 
          <Stack.Screen name="Autoavaliacao" component={AutoavaliacaoScreen} options={{title: "Auto Avaliação", headerStyle:{ 
            backgroundColor: "#D4F7A1", 
            headerTintColor:"#020202ff",
            headerTitleStyle: {
              fontWeight:"bold",
              fontSize: 18,
            },
            headerBackTitleVisible: false,
          }}} />

        <Stack.Screen  name="Register" component={RegisterScreen}  options={{ headerShown: false }}
/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}
