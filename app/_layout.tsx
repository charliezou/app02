import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8FB996", // 青绿色
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#F5F5DC", // 米白色
          borderTopColor: "#E0E0E0",
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: "#8FB996", // 青绿色
        },
        headerTintColor: "#F5F5DC", // 米白色文字
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "收藏",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
