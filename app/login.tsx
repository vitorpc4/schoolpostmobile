import { ApiResponse } from "@/http/Models/Responses/ApiResponse";
import { IloginResponse } from "@/http/Models/Responses/Login/ILoginResponse";
import LoginRepository from "@/http/repository/LoginRepository/LoginRepository";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { useRoute } from "@react-navigation/native";

export default function Login() {
  const expoRouter = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useSession();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonRegister} onPress={createCount}>
        <Text style={styles.buttonText}>cadastrar</Text>
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
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonRegister: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
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
