import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const Header = () => {
  return (
    <View className="bg-[#18274A] px-6 pt-6 pb-8 rounded-b-[30px]" >
        <View className="flex-row justify-between items-center">
            <View>
                <Text className="text-gray-300 text-base">Xin chào, Hưng 👋</Text>
                <Text className="text-white text-3xl font-bold mt-2">Bạn muốn đi đâu hôm nay?</Text>
            </View>
            <TouchableOpacity className="bg-white/10 rounded-full p-3">
                <Ionicons
                    name="notifications-outline"
                    color="white"
                    size={22}
                />
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Header