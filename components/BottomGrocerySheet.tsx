import { View, Text } from "react-native";

interface Props {
  groceryOptions: any[];
  onItemSelected: (item: string, categoryId: number) => void;
}

const BottomGrocerySheet = () => {
  return (
    <View>
      <Text>BottomGrocerySheet</Text>
    </View>
  );
};
export default BottomGrocerySheet;
