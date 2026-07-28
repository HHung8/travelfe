import { Destination } from '@/src/types/home';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface Props {
  item: Destination;
}


const DestinationCard = ({item}:Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ backgroundColor: item.color }}
      className="w-28 h-36 rounded-3xl justify-between p-4 mr-4"
      onPress={() => router.push("/detail")}
    >
      <Text className="text-5xl text-center">
        {item.emoji}
      </Text>
      <Text className="text-white font-bold text-center">
        {item.name}
      </Text>
    </TouchableOpacity>
  )
}

export default DestinationCard;