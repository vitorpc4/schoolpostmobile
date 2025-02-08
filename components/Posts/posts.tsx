import { useSession } from "@/Context/AuthContext";
import IPost from "@/interfaces/IPost";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function Post(item: IPost) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/read",
          params: {
            id: item.id, // Passando o ID
            title: item.title, // Passando o título
            description: item.content, // Passando a descrição
            author: item.username, // Passando o autor
          },
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.author}>Autor: {item.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2f3136",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 8,
    marginTop: 5,
    marginVertical: 2,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#b9bbbe",
  },
  footer: {
    marginTop: 10,
  },
  author: {
    fontSize: 14,
    color: "#b9bbbe",
  },
});
