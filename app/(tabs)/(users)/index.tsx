import ListUsers from "@/components/Users/ListUser";
import UserRepository from "@/http/repository/UserRepository/UserRepository";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as secure from "expo-secure-store";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";
import { IUserAssociation } from "@/http/Models/Responses/Users/IUserAssociation";
import { useSession } from "@/Context/AuthContext";

export default function User() {
  const router = useRouter();

  const [users, setUsers] = useState<IUserAssociation[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const firstRender = useRef(true);
  const { checkSession } = useSession();

  const loadMoreUsers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const data = await getUsers(page);

    if (data.users.length === 0) {
      setHasMore(false);
    } else {
      setUsers((prevUsers) => [...prevUsers, ...data.users]);
      setPage(page + 1);
    }

    setLoading(false);
  };

  const handleCreateUser = () => {
    router.push("/(tabs)/(users)/create");
  };

  const getUsers = async (page: number) => {
    const repository = new UserRepository();

    const userAssociation = JSON.parse(
      secure.getItem("selectedInstance") ?? ""
    ) as IUserSchoolAssociation;

    if (!userAssociation) {
      return { totalItems: 0, hasMore: false, totalPages: 1, users: [] };
    }

    const users = await repository.GetUsersBySchoolId(
      userAssociation.school?.id!,
      page,
      10
    );

    return (
      users.data ?? { totalItems: 0, hasMore: false, totalPages: 1, users: [] }
    );
  };

  const deleteUsers = () => {
    setRefreshing(true);
    setPage(page);

    getUsers(1).then((data) => {
      setUsers(data.users);
      setHasMore(data.hasMore!);
      setRefreshing(false);
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);

    const data = await getUsers(1);

    setUsers(data.users);
    setHasMore(data.hasMore!);

    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  useFocusEffect(
    useCallback(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }

      setRefreshing(true);
      setPage(1);

      getUsers(1).then((data) => {
        setUsers(data.users);
        setHasMore(data.hasMore!);
        setRefreshing(false);
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuários</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateUser}
        >
          <Feather name="plus" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Novo Usuário</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ListUsers user={item} onDeleteSuccess={deleteUsers} />
        )}
        onEndReached={loadMoreUsers}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.1}
        keyExtractor={(item) => item.id.toString()!}
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
  listContent: {
    padding: 16,
  },
});
