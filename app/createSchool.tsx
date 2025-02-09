import { useSession } from "@/Context/AuthContext";
import { SchoolRepository } from "@/http/repository/SchoolRepository/SchoolRepository";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

export default function CreateSchoolScreen() {
  const [schoolName, setSchoolName] = useState("");
  const { email } = useGlobalSearchParams();
  const router = useRouter();

  const { updateToken } = useSession();

  const handleCreateSchool = async () => {
    if (await updateToken(email.toString(), schoolName)) {
      router.push("/(tabs)/(posts)");
    } else {
      router.push("/login");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Criar Escola</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira o nome da escola"
          value={schoolName}
          onChangeText={setSchoolName}
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={[styles.button, !schoolName && styles.buttonDisabled]}
          onPress={handleCreateSchool}
          disabled={!schoolName}
        >
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a0c4e7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
