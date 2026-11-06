import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  onSeeAll?: () => void;
}

const SectionHeader = ({title, onSeeAll}: Props) => {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-white text-xl font-bold">
        {title}
      </Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text className="text-violet-500 font-semibold">
            Xem tất cả
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SectionHeader