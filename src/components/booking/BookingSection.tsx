import React from 'react';
import { Text, View } from 'react-native';
import BookingCard from './BookingCard';

type Props = {
    title: string;
    data: any[];
    onPressItem?: (item:any) => void;
}

const BookingSection = ({ title, data, onPressItem }: Props) => {
    if(data.length === 0) return null;
    return (
        <View className="mb-8">
            <Text className="text-neutral-400 text-xl font-bold mb-4">{title}</Text>
            {data.map((item) => (
                <BookingCard key={item.id} item={item} onPress={() => onPressItem?.(item)} />
            ))}
        </View>
    )
}

export default BookingSection;