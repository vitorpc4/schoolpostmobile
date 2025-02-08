import { useSession } from "@/Context/AuthContext";
import { ChevronDown, LogOut, User } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as secure from "expo-secure-store";
import { useFocusEffect, useRouter } from "expo-router";
import ISchool from "@/interfaces/ISchool";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";
import { TypeUser } from "@/Enum/TypeUser";

export default function InstanceSelector({
  onSelected,
}: {
  onSelected: () => void;
}) {
  const [selectedInstance, setSelectedInstance] =
    useState<IUserSchoolAssociation>({
      user: { id: 0, username: "", email: "", status: false },
      school: { id: "", name: "", status: false },
      status: false,
      typeUser: TypeUser.Student,
      admin: false,
    });
  const [modalVisible, setModalVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const { getUserDataSession, signOut } = useSession() || {};
  const [schools, setSchools] = useState<IUserSchoolAssociation[]>([]);
  const router = useRouter();

  const getSchools = () => {
    const r = getUserDataSession();

    if (r === undefined || r == null) {
      router.push("/login");
    }

    const userSchoolAssociation = r?.map((x) => {
      return {
        user: x.user,
        school: x.school,
        status: x.status,
        typeUser: x.typeUser,
        admin: x.admin,
        id: x.id,
      };
    }) as IUserSchoolAssociation[];

    return userSchoolAssociation as IUserSchoolAssociation[];
  };

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);

  const selectInstance = (instance: any) => {
    setSelectedInstance(instance);
    secure.setItem("selectedInstance", JSON.stringify(selectedInstance));
    toggleModal();
  };

  const onLogout = () => {
    signOut();
    router.push("/login");
  };

  useFocusEffect(
    useCallback(() => {
      const schoolsFiltered = getSchools();
      setSchools(schoolsFiltered);
      setSelectedInstance(schoolsFiltered[0]);
      secure.setItem("selectedInstance", JSON.stringify(schoolsFiltered[0]));
      onSelected();
    }, [onSelected]) // Added getSchools and onSelected as dependencies
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.selector} onPress={toggleModal}>
          <Text style={styles.selectorText}>
            {selectedInstance!.school?.name}
          </Text>
          <ChevronDown size={20} color="#dcddde" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleUserMenu} style={styles.userIcon}>
          <User size={24} color="#dcddde" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={schools}
              keyExtractor={(item) => item.id?.toString() ?? ""}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.instanceItem}
                  onPress={() => selectInstance(item)}
                >
                  <Text style={styles.instanceText}>{item.school?.name!}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={userMenuVisible}
        onRequestClose={toggleUserMenu}
      >
        <TouchableOpacity
          style={styles.userModalOverlay}
          activeOpacity={1}
          onPress={toggleUserMenu}
        >
          <View style={styles.userMenuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onLogout();
                toggleUserMenu();
              }}
            >
              <LogOut size={20} color="#dcddde" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1e1f22",
    borderBottomWidth: 1,
    borderBottomColor: "#2f3136",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    flex: 1,
  },
  selectorText: {
    color: "#dcddde",
    fontSize: 16,
    fontWeight: "500",
  },
  userIcon: {
    padding: 8,
    backgroundColor: "#2f3136",
    borderRadius: 20,
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "50%",
    backgroundColor: "#2f3136",
    borderRadius: 8,
    overflow: "hidden",
  },
  instanceItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#40444b",
  },
  instanceText: {
    color: "#dcddde",
    fontSize: 16,
  },
  userModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  userMenuContainer: {
    backgroundColor: "#2f3136",
    borderRadius: 8,
    marginTop: 50,
    marginRight: 10,

    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  menuText: {
    color: "#dcddde",
    fontSize: 16,
    marginLeft: 8,
  },
});
