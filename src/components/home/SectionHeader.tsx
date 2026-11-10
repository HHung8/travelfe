import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";

interface Props {
  title: string;
  onSeeAll?: () => void;
}

const SectionHeader = ({title, onSeeAll}: Props) => {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <AppText className="text-white text-xl font-bold">
        {title}
      </AppText>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <AppText className="text-violet-500 font-semibold">
            Xem tất cả
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SectionHeader