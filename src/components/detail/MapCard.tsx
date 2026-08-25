import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
type Props = {
    locationLabel: string;
    latitude?: number;
    longitude?: number;
};

const MapCard = ({ locationLabel, latitude, longitude }: Props) => {
    const hasCoords = latitude != null && longitude != null;
    const openInMapsApp = () => {
        if (!hasCoords) return;
        Linking.openURL(`https://maps.apple.com/?q=${latitude},${longitude}`);
    };
    
    return (
        <View className="mt-8 px-6">
            <Text className="text-white text-xl font-bold mb-4">Địa điểm</Text>

            <View className="bg-[#252525] rounded-3xl h-48 overflow-hidden">
                {hasCoords ? (
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pointerEvents="none" // chặn tương tác trực tiếp trên card, bấm nút bên dưới để xem full
                    >
                        <Marker coordinate={{ latitude, longitude }} title={locationLabel} />
                    </MapView>
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Ionicons name="map" size={60} color="#8B5CF6" />
                        <Text className="text-neutral-400 mt-2">Chưa có tọa độ</Text>
                    </View>
                )}

                <TouchableOpacity
                    className="absolute bottom-3 self-center bg-violet-600 rounded-full px-6 py-3"
                    onPress={openInMapsApp}
                    disabled={!hasCoords}
                >
                    <Text className="text-white font-semibold">Xem bản đồ</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-neutral-400 mt-2 text-center">{locationLabel}</Text>
        </View>
    );
};

export default MapCard;
