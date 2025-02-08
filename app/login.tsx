import { ApiResponse } from "@/http/Models/Responses/ApiResponse";
import { IloginResponse } from "@/http/Models/Responses/Login/ILoginResponse";
import LoginRepository from "@/http/repository/LoginRepository/LoginRepository";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSession } from "@/Context/AuthContext";
import { LogInIcon, UserRoundPlus } from "lucide-react-native";

export default function Login() {
  const expoRouter = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, checkSession } = useSession();

  const handleLogin = () => {
    signIn(email, password)
      .then((result) => {
        if (result.success) {
          if (result.haveSchool) {
            expoRouter.push("/(tabs)/(posts)");
          } else {
            expoRouter.push({
              pathname: "/createSchool",
              params: { email: email },
            });
          }
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  const createCount = () => {
    expoRouter.push("/register");
  };

  useFocusEffect(
    useCallback(() => {
      const res = SecureStore.getItem("session");
      if (res) {
        expoRouter.push("/(tabs)/(posts)");
      }
    }, [])
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <LogInIcon size={24} color="#fff" style={{ marginRight: 5 }} />
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonRegister} onPress={createCount}>
        <UserRoundPlus size={24} color="#fff" style={{ marginRight: 5 }} />
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1e1f22",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#4a5568",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#4a5568",
    color: "#ffffff",
  },
  button: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    backgroundColor: "#4a5568",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonRegister: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    backgroundColor: "#4a5568",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
