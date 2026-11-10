import React from 'react'
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";const Header = () => {
  return (
    <View className="px-6 pt-6 pb-8 rounded-b-[30px]" >
        <View className="flex-row justify-between items-center">
            <View>
                <AppText className="text-gray-300 text-base">Xin chào, Hưng 👋</AppText>
                <AppText className="text-white text-3xl font-bold mt-2">Bạn muốn đi đâu hôm nay?</AppText>
            </View>
            {/* <TouchableOpacity className="bg-white/10 rounded-full p-3">
                <Ionicons
                    name="notifications-outline"
                    color="white"
                    size={22}
                />
            </TouchableOpacity> */}
        </View>
    </View>
  )
}

export default Header