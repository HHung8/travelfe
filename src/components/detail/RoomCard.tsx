import { getRoomImages } from "@/src/services/roomService";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { RoomImage } from "../../types/roomImage";

type Room = {
    id: string;
    roomType: string;
    capacity: number;
    pricePerNight: number;
};

type Props = {
    room: Room;
    token: string | null;
};

const RoomCard = ({ room, token }: Props) => {
    const [images, setImages] = useState<RoomImage[]>([]);
    const [loadingImages, setLoadingImages] = useState(true);

    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    
    useEffect(() => {
        let mounted = true;
        getRoomImages(token, room.id)
            .then((data) => {
                if (mounted) setImages(data);
            })
            .catch((err) => console.log("error loading room images", err))
            .finally(() => {
                if (mounted) setLoadingImages(false);
            });
        return () => { mounted = false; }
    }, [room.id, token]);

    const openViewer = (index:number) => {
        setViewerIndex(index);
        setViewerVisible(true);
    }

    return (
        <View className="bg-neutral-900 rounded-2xl overflow-hidden mb-3">
            {loadingImages ? (
                <View className="h-32 items-center justify-center bg-neutral-800">
                    <ActivityIndicator color="#8B5CF6" size="small" />
                </View>
            ) : images.length > 0 ? (
                <FlatList
                    horizontal
                    data={images}
                    keyExtractor={(img) => img.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => openViewer(index)}>
                            <Image source={{ uri: item.imageUrl }} className="w-40 h-32 mr-1" resizeMode="cover" />
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View className="h-32 items-center justify-center bg-neutral-800">
                    <Text style={{ fontSize: 32 }}>🛏️</Text>
                </View>
            )}

            <View className="p-3 flex-row justify-between items-center">
                <View className="flex-1 pr-2">
                    <Text className="text-white font-medium">{room.roomType}</Text>
                    <Text className="text-neutral-500 text-xs mt-1">{room.capacity} khách</Text>
                </View>
                <Text className="text-violet-400 font-semibold">${room.pricePerNight}/đêm</Text>
            </View>
            <ImageViewing
                images={images.map((img) => ({ uri: img.imageUrl }))}
                imageIndex={viewerIndex}
                visible={viewerVisible}
                onRequestClose={() => setViewerVisible(false)}
            />
        </View>

    )
};

export default RoomCard;
