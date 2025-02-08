import PostRepository from "@/http/repository/PostRepository/PostRepository";
import IPost from "@/interfaces/IPost";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import * as secure from "expo-secure-store";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Toast from "react-native-toast-message";

export default function ListAdminPosts({
  item,
  onDeleteSuccess,
}: {
  item: IPost;
  onDeleteSuccess: () => void;
}) {
  const router = useRouter();

  const deletePost = () => {
    Alert.alert("Excluir Post", "Tem certeza que deseja excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: () => {
          const postRepository = new PostRepository();

          const userSchoolAssociation = JSON.parse(
            secure.getItem("selectedInstance") ?? ""
          ) as IUserSchoolAssociation;

          if (!userSchoolAssociation) {
            return;
          }

          Toast.show({
            type: "success",
            text1: "Post excluído",
            text2: "O post foi excluído com sucesso",
          });

          postRepository
            .DeletePost(item.id!, userSchoolAssociation.school?.id!)
            .then(() => {
              Toast.show({
                type: "success",
                text1: "Post excluído",
                text2: "O post foi excluído com sucesso",
              });
              onDeleteSuccess();
            })
            .catch((error) => {
              console.error("Erro ao excluir post", error);
            });
        },
      },
    ]);
  };

  const editPost = () => {
    router.push({
      pathname: "/(tabs)/(adminposts)/edit",
      params: {
        id: item.id,
        title: item.title,
        content: item.content,
        isDraft: item.isDraft ? "true" : "false",
      },
    });
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.content}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={editPost}
        >
          <Feather name="edit-2" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={deletePost}
        >
          <Feather name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2f3136",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5865f2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  draftToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  draftToggleText: {
    color: "#dcddde",
    marginRight: 8,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#2f3136",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dcddde",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#96989d",
  },
  actionContainer: {
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
