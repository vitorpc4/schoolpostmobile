import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import PostRepository from "@/http/repository/PostRepository/PostRepository";
import * as secure from "expo-secure-store";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";
import IPost from "@/interfaces/IPost";

export default function EditPost() {
  const router = useRouter();
  const { id, title, content, isDraft } = useLocalSearchParams();

  const [titleToBeEdit, setTitle] = useState(title as string);
  const [contentToBeEdit, setContent] = useState(content as string);

  const [DraftToBeEdit, setIsDraft] = useState(isDraft === "true");

  const handleSave = () => {
    const repository = new PostRepository();

    const userSchoolAssociation = JSON.parse(
      secure.getItem("selectedInstance") ?? ""
    ) as IUserSchoolAssociation;

    if (!userSchoolAssociation) {
      return;
    }

    const post: IPost = {
      content: contentToBeEdit,
      title: titleToBeEdit,
      id: Number(id),
      isDraft: DraftToBeEdit,
      status: true,
      username: userSchoolAssociation.user.username,
    };

    repository
      .UpdatePost(post, userSchoolAssociation.school?.id!)
      .then(() => {
        router.back();
      })
      .catch((error) => {
        console.error("Erro ao criar post", error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={titleToBeEdit}
          onChangeText={setTitle}
          placeholder="Digite o título do post"
          placeholderTextColor="#96989d"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={contentToBeEdit}
          onChangeText={setContent}
          placeholder="Digite a descrição do post"
          placeholderTextColor="#96989d"
          multiline
          numberOfLines={6}
        />

        <View style={styles.draftContainer}>
          <Text style={styles.draftLabel}>Rascunho</Text>
          <Switch
            value={DraftToBeEdit}
            onValueChange={setIsDraft}
            trackColor={{ false: "#767577", true: "#5865f2" }}
            thumbColor={isDraft ? "#dcddde" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1f22",
  },
  scrollContent: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dcddde",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2f3136",
    borderRadius: 8,
    padding: 12,
    color: "#dcddde",
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  draftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  draftLabel: {
    fontSize: 16,
    color: "#dcddde",
  },
  saveButton: {
    backgroundColor: "#5865f2",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
