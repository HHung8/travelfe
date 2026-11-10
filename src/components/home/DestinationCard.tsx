// import { Destination } from '@/src/types/home';
import { Destination } from '@/src/types/destination';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";

interface Props {
  item: Destination;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500835556837-99ac94a94552";

const DestinationCard = ({item}:Props) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="w-28 h-36 rounded-3xl overflow-hidden mr-4"
      onPress={() => router.push({ pathname: "/detail", params: { destinationId: item.id } })}
    >
      <Image 
        source={{ uri: item.thumbnailUrl || FALLBACK_IMAGE }}
        className="w-full h-full absolute"
        resizeMode="cover"
      />
      <View 
        className = "absolute bottom-0 left-0 right-0 px-2 py-2"
        style={{ backgroundColor:"rgba(0,0,0,0.45)" }}
      >
        <AppText className="text-white font-bold text-center" numberOfLines={1}>
          {item.name}
        </AppText>
        <AppText className="text-neutral-300 text-xs text-center" numberOfLines={1}>
          {item.city}
        </AppText>
      </View>
    </TouchableOpacity>
  )
}

export default DestinationCard;