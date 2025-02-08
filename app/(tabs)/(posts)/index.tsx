import Post from "@/components/Posts/posts";
import PostRepository from "@/http/repository/PostRepository/PostRepository";
import IPost from "@/interfaces/IPost";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as secure from "expo-secure-store";
import { IPostResponse } from "@/http/Models/Responses/Posts/IPostResponse";
import { useFocusEffect } from "expo-router";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";

export default function posts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const firstRender = useRef(true);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const newPosts = await getPosts(page);

    if (newPosts.posts.length === 0) {
      setHasMore(false);
      setLoading(false);
    } else {
      const filter = newPosts.posts.filter((post) => {
        return posts.find((p) => p.id === post.id) === undefined;
      });
      setPosts((prevPosts) => [...prevPosts, ...filter]);
      setPage(page + 1);
    }

    setLoading(false);
  };

  const getPosts = async (page: number): Promise<IPostResponse> => {
    const repository: PostRepository = new PostRepository();

    const userAssociation = JSON.parse(
      secure.getItem("selectedInstance") ?? ""
    ) as IUserSchoolAssociation;

    if (!userAssociation) {
      return { totalItems: 0, hasMore: false, totalPages: 1, posts: [] };
    }

    const posts = await repository.GetPosts(
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
    setPage(1);

    const newPosts = await getPosts(1);

    setPosts(newPosts.posts);
    setHasMore(newPosts.hasMore!);

    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      setRefreshing(true);
      setPage(1);

      getPosts(1).then((newPosts) => {
        setPosts(newPosts.posts);
        setHasMore(newPosts.hasMore!);
        setRefreshing(false);
        setLoading(false);
      });
    }, [])
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Posts</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post {...item} />}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  listContent: {
    padding: 8,
  },
});
