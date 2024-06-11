import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { supabase } from "../../config/initSupabase";
import BottomGrocerySheet from "@/components/BottomGrocerySheet";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ListRenderItem } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Page = () => {
  const [listItems, setListItems] = useState<any[]>([]);
  const { user } = useAuth();
  const [groceryOptions, setGroceryOptions] = useState<any[]>([
    "Banana",
    "Apple",
    "Oats",
    "Milk",
    "Eggs",
    "Bread",
    "Butter",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      let { data: categories } = await supabase
        .from("categories")
        .select("id, category");
      const { data: products } = await supabase
        .from("products")
        .select()
        .eq("historic", false);
      const { data: historic } = await supabase
        .from("products")
        .select()
        .eq("historic", true);

      if (historic) {
        // remove duplicate names
        const combinedHistoric = [
          ...historic.map((item: any) => item.name),
          ...groceryOptions,
        ];
        const uniqueHistoric = [...new Set(combinedHistoric)];
        setGroceryOptions(uniqueHistoric);
      }

      // Group products by category
      if (products) {
        const grouped: any = categories?.map((category: any) => {
          const items = products.filter(
            (product: any) => product.category === category.id
          );
          return { ...category, data: items };
        });
        setListItems(grouped);
      }
    };
    fetchData();
  }, []);

  const onAddItem = async (name: string, categoryId: number) => {
    console.log("Item Added", name);
    console.log("Category ID", categoryId);
    const result = await supabase
      .from("products")
      .insert([{ name, category: categoryId, user_id: user?.id }])
      .select();

    if (result.data) {
      console.log("Result", result.data);
      const category = listItems.find((category) => category.id === categoryId);
      if (category) {
        category.data.push(result.data[0]);
        setListItems((prev) => [...prev]);
      }
    }
  };

  const renderGroceryRow: ListRenderItem<any> = ({ item: grocery }) => {
    const onSelect = async () => {
      console.log("UPDATE: ", grocery);
      await supabase
        .from("products")
        .update({ historic: true })
        .eq("id", grocery.id);
      const category = listItems.find(
        (category) => category.id === grocery.category
      );
      if (category) {
        category.data = category.data.filter(
          (item: any) => item.id !== grocery.id
        );
        setListItems((prev) => [...prev]);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.groceryRow, { backgroundColor: "#0c3824" }]}
        onPress={onSelect}
      >
        <Text style={styles.groceryName}>{grocery.name}</Text>
        <Ionicons name="checkmark" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {listItems.length > 0 && (
        <SectionList
          renderSectionHeader={({ section: { category } }) => (
            <Text style={styles.sectionHeader}>{category}</Text>
          )}
          contentContainerStyle={{ paddingBottom: 150 }}
          sections={listItems}
          renderItem={renderGroceryRow}
        />
      )}
      <Text>Page</Text>
      <BottomGrocerySheet
        groceryOptions={groceryOptions}
        onItemSelected={(item, category) => {
          onAddItem(item, category);
        }}
      />
    </GestureHandlerRootView>
  );
};
export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a2a2a",
  },
  groceryRow: {
    flexDirection: "row",
    backgroundColor: "#2b825b",
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 4,
  },
  groceryName: {
    color: "#fff",
    fontSize: 20,
    flex: 1,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 20,
  },
});
