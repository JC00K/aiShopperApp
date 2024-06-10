import { useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, ListRenderItem } from "react-native";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

interface Props {
  groceryOptions: any[];
  onItemSelected: (item: string, categoryId: number) => void;
}

const BottomGrocerySheet = (props: Props) => {
  const snapPoints = useMemo(() => ["14%", "75%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [item, setItem] = useState("");
  const renderRecommendationRow: ListRenderItem<any> = ({ item }) => {
    return <Text style={{ color: "#fff" }}>{item}</Text>;
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
