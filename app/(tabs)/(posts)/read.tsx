import IPost from "@/interfaces/IPost";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import WebView from "react-native-webview";

export default function ReadPost() {
  const { id, title, description, author } = useLocalSearchParams();
  const { width, height } = Dimensions.get("window");

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft stroke="#dcddde" width={24} height={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.authorContainer}>
          <Text style={styles.authorLabel}>Autor: </Text>
          <Text style={styles.authorName}>{author}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.container}>
          <WebView
            style={{
              width: width * 0.92,
              height: height * 0.5,
              color: "#dcddde",
              backgroundColor: "#1e1f22",
            }}
            originWhitelist={["*"]}
            source={{
              html: `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      body {
                        color: #dcddde;
                        background-color: #1e1f22;
                        font-size: 16px;
                        word-wrap: break-word;
                        white-space: normal;
                        overflow-wrap: break-word;
                        max-width: 100%;
                        text-align: justify;
                        padding: 2px;
                      }
                    </style>
                  </head>
                  <body>
                    ${description.toString()}
                  </body>
                </html>
              `,
            }}
          />
        </View>

        {/* <Text style={styles.description}>{description}</Text> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1f22",
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2f3136",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#2f3136",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  authorLabel: {
    color: "#96989d",
    fontSize: 16,
  },
  authorName: {
    color: "#dcddde",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#2f3136",
    marginBottom: 16,
  },
  description: {
    color: "#dcddde",
    fontSize: 16,
    lineHeight: 24,
  },
});
