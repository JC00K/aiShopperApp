import { useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/config/initSupabase";

interface Props {
  groceryOptions: any[];
  onItemSelected: (item: string, categoryId: number) => void;
}

const BottomGrocerySheet = (props: Props) => {
  const snapPoints = useMemo(() => ["14%", "75%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [item, setItem] = useState("");

  const renderRecommendationRow: ListRenderItem<any> = ({ item }) => {
    const onAddItem = async () => {
      console.log(item);

      const { data } = await supabase.functions.invoke("getEmbedding", {
        body: { input: item },
      });
      const { data: documents } = await supabase.rpc("match_category", {
        query_embedding: data.embedding,
        match_threshold: 0.8,
        match_count: 1,
      });
      props.onItemSelected(item, documents[0].id);
      setItem("");
      bottomSheetRef.current?.collapse();
    };
    return (
      <TouchableOpacity style={styles.groceryRow} onPress={onAddItem}>
        <Text style={{ color: "#fff", fontSize: 20, flex: 1 }}>{item}</Text>
        <Ionicons name="add-circle-outline" size={24} color={"#fff"} />
      </TouchableOpacity>
    );
  };
  return (
    <BottomSheet
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      handleIndicatorStyle={{ backgroundColor: "#fff" }}
      backgroundStyle={{ backgroundColor: "#151515" }}
    >
      <View style={styles.searchRow}>
        <BottomSheetTextInput
          style={styles.inputField}
          placeholder="I need..."
          placeholderTextColor={"#fff"}
          onChangeText={setItem}
          value={item}
        />
      </View>
      <BottomSheetFlatList
        data={
          item !== "" ? [item, ...props.groceryOptions] : props.groceryOptions
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRecommendationRow}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#2b825b",
    borderRadius: 4,
    padding: 10,
    color: "#fff",
    backgroundColor: "#363636",
    marginBottom: 40,
  },
  groceryContainer: {
    paddingBottom: 20,
  },
  groceryRow: {
    flexDirection: "row",
    backgroundColor: "#2b825b",
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 4,
  },
});

export default BottomGrocerySheet;
