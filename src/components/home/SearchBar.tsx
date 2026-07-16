import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

const SearchBar = () => {
  return (
    <View className="px-6 -mt-6 mb-6">
      <View className="flex-row items-center bg-[#465577] rounded-2xl h-14 px-4">

        <Ionicons
          name="search-outline"
          size={22}
          color="#C9D0E0"
        />

        <TextInput
          placeholder="Tìm điểm đến, tour..."
          placeholderTextColor="#C9D0E0"
          className="flex-1 ml-3 text-white"
        />

      </View>
    </View>
  );
}

export default SearchBar