import { IUserAssociation } from "@/http/Models/Responses/Users/IUserAssociation";
import UserRepository from "@/http/repository/UserRepository/UserRepository";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";

export default function ListUsers({
  user,
  onDeleteSuccess,
}: {
  user: IUserAssociation;
  onDeleteSuccess: () => void;
}) {
  const router = useRouter();

  const handleEditUser = () => {
    router.push({
      pathname: "/(tabs)/(users)/edit",
      params: {
        id: user.id,
        name: user.username,
        email: user.email,
        userType: user.typeUser,
      },
    });
  };

  const handleDeleteUser = () => {
    Alert.alert(
      "Excluir Usuário",
      "Tem certeza que deseja excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            const repository = new UserRepository();

            repository.DeleteUser(user.id.toString()).then(() => {
              onDeleteSuccess();
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditUser}
        >
          <Feather name="edit-2" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteUser}
        >
          <Feather name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2f3136",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#b9bbbe",
  },
  userActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#4a5568",
  },
  deleteButton: {
    backgroundColor: "#e53e3e",
  },
});
