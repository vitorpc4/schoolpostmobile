import { Tabs, useRouter } from "expo-router";
import { FileSliders, StickyNote, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert, StyleSheet, View } from "react-native";
import InstanceSelector from "@/components/Global/InstanceSelector";
import Toast from "react-native-toast-message";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";
import { TypeUser } from "@/Enum/TypeUser";
import React from "react";
import { useSession } from "@/Context/AuthContext";

export default function TabLayout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);

  const { checkSession } = useSession();

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 0);
  }, []);

  const schoolSelected = () => {
    const userAssociation = JSON.parse(
      SecureStore.getItem("selectedInstance") ?? ""
    ) as IUserSchoolAssociation;

    if (userAssociation?.typeUser === TypeUser.Professor) {
      setIsProfessor(true);
    } else {
      setIsProfessor(false);
    }
  };

  return ready ? (
    <View style={sytles.container}>
      <View>
        <InstanceSelector onSelected={schoolSelected} />
      </View>
      <Tabs>
        <Tabs.Screen
          name="(posts)"
          options={{
            headerShown: false,
            tabBarLabel: "Post",
            tabBarIcon: ({ color, size }) => (
              <StickyNote size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(adminposts)"
          options={{
            headerShown: false,
            tabBarLabel: "Admin Post",
            href: isProfessor ? "/(tabs)/(adminposts)" : null,
            tabBarIcon: ({ color, size }) => (
              <FileSliders size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(users)"
          options={{
            headerShown: false,
            tabBarLabel: "Users",
            href: isProfessor ? "/(tabs)/(users)" : null,
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
      <Toast />
    </View>
  ) : null;
}

const sytles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
