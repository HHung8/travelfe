
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";

type Props = {
    title: string;
    location: string; // "City, Country"
    climate: string | null;
    bestTimeToVisit: string | null;
    description: string;
}

const DestinationInfo = ({title, location, climate, bestTimeToVisit, description}: Props) => {
  return (
    <View className='px-6 mt-6'>
      <AppText className='text-white text-3xl font-bold'>{title}</AppText>
      <View className='flex-row items-center mt-3'>
            <Ionicons name='location-outline' size={18} color="#9CA3AF" />
            <AppText className='text-gray-400 ml-2'>{location}</AppText>
      </View>

      {/* <View className='flex-row justify-between mt-8' > 
          <View className='items-center flex-1'>
                <View className='w-14 h-14 rounded-full bg-[#2B2B2B] items-center justify-center'>
                    <Ionicons name='sunny-outline' size={24} color="white" />
                </View>
                <AppText className='text-gray-400 mt-3 capitalize'>{climate || "Chưa cập nhật"}</AppText>
          </View>
          <View className='items-center flex-1'>
                <View className='w-14 h-14 rounded-full bg-[#2B2B2B] items-center justify-center'>
                    <Ionicons name='calendar-outline' size={24} color="white"/>
                </View>
                <AppText className='text-gray-400 mt-3 capitalize'>{bestTimeToVisit || "Chưa cập nhật"}</AppText>
          </View>
      </View> */}

      <View className='mt-8'>
            <AppText className='text-white text-xl font-bold mb-3' >Giới thiệu</AppText>
            <AppText className='text-gray-400 leading-7' >{description}</AppText>
      </View>
    </View>
  )
}

export default DestinationInfo;