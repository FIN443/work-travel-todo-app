import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";
const STATE_KEY = "@state";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [editText, setEditText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = async () => {
    setWorking(false);
    await saveWorkState(false);
  };
  const work = async () => {
    setWorking(true);
    await saveWorkState(true);
  };
  const onChangeText = (payload) => setText(payload);
  const onChangeEditText = (payload) => setEditText(payload);
  const saveWorkState = async (isWork) => {
    await AsyncStorage.setItem(STATE_KEY, JSON.stringify({ isWork }));
  };
  const loadWorkState = async () => {
    try {
      const s = await AsyncStorage.getItem(STATE_KEY);
      setWorking(JSON.parse(s).isWork);
    } catch (e) {
      console.log(e);
    }
  };
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const resetToDosEditing = (loadToDos) => {
    let newToDos = {};
    Object.keys(loadToDos).map((key) => {
      newToDos = {
        ...newToDos,
        [key]: { ...loadToDos[key], isEditing: false },
      };
    });
    return newToDos;
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      const newToDos = resetToDosEditing(JSON.parse(s));
      setToDos(newToDos);
    } catch (e) {
      // error
      console.log(e);
    }
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    // save to do
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, isDone: false, isEditing: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "Cancle" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          // useState는 mutate가 안되기 때문에 새로운 객체 생성 후 delete 사용 가능
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  const doneToDo = (key) => {
    let newToDos = { ...toDos };
    newToDos[key] = { ...newToDos[key], isDone: !newToDos[key].isDone };
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const editToDo = (key) => {
    setEditText(toDos[key].text);
    let newToDos = resetToDosEditing(toDos);
    newToDos[key] = { ...newToDos[key], isEditing: !newToDos[key].isEditing };
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const editDone = (key) => {
    let newToDos = { ...toDos };
    if (editText === "") {
      newToDos[key] = { ...newToDos[key], isEditing: !newToDos[key].isEditing };
      setToDos(newToDos);
      saveToDos(newToDos);
      return;
    }
    newToDos = {
      ...newToDos,
      [key]: {
        ...newToDos[key],
        text: editText,
        isEditing: !newToDos[key].isEditing,
      },
    };
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  useEffect(() => {
    loadWorkState();
    loadToDos();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType="done"
        value={text}
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        style={styles.input}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View
              style={{
                ...styles.toDo,
                paddingVertical: !toDos[key].isEditing ? 20 : 15,
                paddingHorizontal: !toDos[key].isEditing ? 20 : 12,
              }}
              key={key}
            >
              {!toDos[key].isEditing ? (
                <>
                  <Text
                    style={
                      !toDos[key].isDone
                        ? styles.toDoText
                        : {
                            ...styles.toDoText,
                            textDecorationLine: "line-through",
                            color: theme.grey,
                          }
                    }
                  >
                    {toDos[key].text}
                  </Text>
                  <View style={styles.toDoIcons}>
                    {!toDos[key].isDone ? (
                      <TouchableOpacity onPress={() => editToDo(key)}>
                        <Feather
                          style={{ ...styles.icon, paddingRight: 8 }}
                          name="edit-2"
                          size={20}
                          color={theme.grey}
                        />
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity onPress={() => doneToDo(key)}>
                      <MaterialIcons
                        style={styles.icon}
                        name="done"
                        size={24}
                        color={theme.grey}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => deleteToDo(key)}>
                      <FontAwesome
                        style={{ ...styles.icon, paddingRight: 0 }}
                        name="trash"
                        size={20}
                        color={theme.grey}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <TextInput
                    returnKeyType="done"
                    style={styles.editInput}
                    value={editText}
                    onChangeText={onChangeEditText}
                    onSubmitEditing={() => editDone(key)}
                    placeholder="Edit a To Do"
                  />
                  <TouchableOpacity onPress={() => editDone(key)}>
                    <MaterialIcons
                      style={styles.icon}
                      name="done"
                      size={24}
                      color={theme.grey}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    paddingHorizontal: 5,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  editInput: {
    backgroundColor: "white",
    width: "88%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    fontSize: 16,
  },
});
