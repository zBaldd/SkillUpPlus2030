
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import TrilhasScreen from "../screens/TrilhasScreen";
import AutoavaliacaoScreen from "../screens/AutoavaliacaoScreen";
import PerfilScreen from "../screens/ProfileScreen";
import CursosScreen from "../screens/CursosScreen";
import ProgressoScreen from "../screens/ProgressoScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#E6E6E6",
        tabBarStyle: {
          backgroundColor: "#5A67D8",
          borderTopWidth: 0,
          height: 62,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          
          let iconName = "ellipse";

          if (route.name === "Início") iconName = focused ? "home" : "home-outline";
          if (route.name === "Trilhas") iconName = focused ? "book" : "book-outline";
          if (route.name === "Cursos") iconName = focused ? "library" : "library-outline";
          if (route.name === "Autoavaliação") iconName = focused ? "calculator" : "calculator-outline";
          if (route.name === "Progresso") iconName = focused ? "stats-chart" : "stats-chart-outline";
          if (route.name === "Perfil") iconName = focused ? "person" : "person-outline";
          if (route.name === "Configurações") iconName = focused ? "settings" : "settings-outline";

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Trilhas" component={TrilhasScreen} />
      <Tab.Screen name="Cursos" component={CursosScreen} />
      <Tab.Screen name="Autoavaliação" component={AutoavaliacaoScreen} />
      <Tab.Screen name="Progresso" component={ProgressoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
