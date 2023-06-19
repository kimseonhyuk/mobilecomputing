import React, { useState, useEffect } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications"; // Expo Notifications 라이브러리 추가
import "react-native-get-random-values";
import CalendarPage from "./screens/CalendarPage";
import HomePage from "./screens/HomePage";
import LibraryPage from "./screens/LibraryPage";
import MyPage from "./screens/MyPage";

export default function App() {
  const Tab = createBottomTabNavigator();
  const [medicationList, setMedicationList] = useState([]);

  useEffect(() => {
    // 앱 시작 시 Expo 푸시 알림 설정
    registerForPushNotificationsAsync().then((token) => {
      console.log(token);
    });

    // 푸시 알림 수신 이벤트 리스너 등록
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("푸시 알림 수신:", notification);
    });

    // 앱 종료 시 이벤트 리스너 제거
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const handleSaveMedication = async (name, time) => {
    const medication = { name, time };
    setMedicationList([...medicationList, medication]);

    // 푸시 알림 예약
    try {
      const trigger = new Date(time);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "알림",
          body: `${name} 복용 시간입니다.`,
          sound: "default",
        },
        trigger,
      });
      console.log("알림이 예약되었습니다.");
    } catch (error) {
      console.log("알림 예약에 실패했습니다:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.appContainer}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color }) => {
                switch (route.name) {
                  case "HomePage":
                    return (
                      <Ionicons name="home-sharp" size={24} color={color} />
                    );
                  case "CalendarPage":
                    return (
                      <Ionicons name="calendar-sharp" size={24} color={color} />
                    );
                  case "LibraryPage":                   
                     return <Ionicons name="heart" size={24} color={color} />;
                  case "MyPage":
                    return <Feather name="user" size={24} color={color} />;
                  }
                },
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
              })}
            >
              <Tab.Screen name="HomePage">
                {(props) => (
                  <HomePage {...props} onSaveMedication={handleSaveMedication} />
                )}
              </Tab.Screen>
              <Tab.Screen name="CalendarPage" component={CalendarPage} />
              <Tab.Screen name="LibraryPage">
                {(props) => (
                  <LibraryPage {...props} medicationList={medicationList} />
                )}
              </Tab.Screen>
              <Tab.Screen name="MyPage" component={MyPage} />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </GestureHandlerRootView>
    );
  }
  
  const styles = StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
  });
  
