import PostRepository from "@/http/repository/PostRepository/PostRepository";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import * as secure from "expo-secure-store";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IPostResponse } from "@/http/Models/Responses/Posts/IPostResponse";
import IPost from "@/interfaces/IPost";
import ListAdminPosts from "@/components/AdminPosts/ListPosts";
import ISchool from "@/interfaces/ISchool";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";

const initialPosts = [
  {
    id: "1",
    title: "Primeiro Post",
    description: "Descrição do primeiro post",
    isDraft: false,
  },
  {
    id: "2",
    title: "Segundo Post",
    description: "Descrição do segundo post",
    isDraft: true,
  },
  {
    id: "3",
    title: "Terceiro Post",
    description: "Descrição do terceiro post",
    isDraft: false,
  },
  {
    id: "4",
    title: "Quarto Post",
    description: "Descrição do quarto post",
    isDraft: true,
  },
];

export default function AdminPosts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const firstRender = useRef(true);

  const router = useRouter();

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const newPosts = await getPosts(page);

    if (newPosts.posts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts.posts]);
      setPage(page + 1);
    }

    setLoading(false);
  };

  const createPost = () => {
    router.push("/(tabs)/(adminposts)/create");
  };

  const getPosts = async (page: number): Promise<IPostResponse> => {
    const postRepository = new PostRepository();

    const userAssociation = JSON.parse(
      secure.getItem("selectedInstance") ?? ""
    ) as IUserSchoolAssociation;

    if (!userAssociation) {
      return { totalItems: 0, hasMore: false, totalPages: 1, posts: [] };
    }

    const posts = await postRepository.GetPublishedPostsAndDrafts(
      page,
      10,
      userAssociation.school?.id!
    );

    return (
      posts?.data ?? { totalItems: 0, hasMore: false, totalPages: 1, posts: [] }
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1); // Resetar para a primeira página

    const newPosts = await getPosts(1);

    setPosts(newPosts.posts);
    setHasMore(newPosts.hasMore!);

    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  const deletePost = () => {
    setRefreshing(true);
    setPage(page);

    getPosts(1).then((newPosts) => {
      setPosts(newPosts.posts);
      setHasMore(newPosts.hasMore!);
      setRefreshing(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (firstRender.current) {
        firstRender.current = false; // Impede execução dupla na primeira vez
        return;
      }

      setRefreshing(true);
      setPage(1);
      getPosts(1).then((newPosts) => {
        setPosts(newPosts.posts);
        setHasMore(newPosts.hasMore!);
        setRefreshing(false);
      });
    }, [])
  );

  const filteredPosts = showDrafts
    ? posts.filter((post) => post.isDraft)
    : posts.filter((post) => !post.isDraft);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.createButton} onPress={createPost}>
          <Feather name="plus" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Criar Post</Text>
        </TouchableOpacity>
        <View style={styles.draftToggle}>
          <Text style={styles.draftToggleText}>Mostrar Rascunhos</Text>
          <Switch
            value={showDrafts}
            onValueChange={setShowDrafts}
            trackColor={{ false: "#767577", true: "#5865f2" }}
            thumbColor={showDrafts ? "#dcddde" : "#f4f3f4"}
          />
        </View>
      </View>
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => (
          <ListAdminPosts item={item} onDeleteSuccess={deletePost} />
        )}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        onEndReached={loadMorePosts}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1f22",
  },
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
