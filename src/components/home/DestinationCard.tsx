import { Destination } from '@/src/types/home';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface Props {
  item: Destination;
}


const DestinationCard = ({item}:Props) => {
  return (
    <TouchableOpacity
      style={{ backgroundColor: item.color }}
      className="w-28 h-36 rounded-3xl justify-between p-4 mr-4"
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