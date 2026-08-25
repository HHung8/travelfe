import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const SearchBar = () => {
  const router = useRouter();

  return (
    <View className="px-6 mt-6 mb-6">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center bg-[#465577] rounded-2xl h-14 px-4"
        onPress={() => router.push("/search")}
      > 
        <Ionicons name="search-outline" size={22} color="#C9D0E0" />
        <Text className="flex-1 ml-3 text-[#C9D0E0]">Tìm điểm đến, tour</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SearchBar