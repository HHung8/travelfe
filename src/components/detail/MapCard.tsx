import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";
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
            <AppText className="text-white text-xl font-bold mb-4">Địa điểm</AppText>

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
                        <AppText className="text-neutral-400 mt-2">Chưa có tọa độ</AppText>
                    </View>
                )}

                <TouchableOpacity
                    className="absolute bottom-3 self-center bg-violet-600 rounded-full px-6 py-3"
                    onPress={openInMapsApp}
                    disabled={!hasCoords}
                >
                    <AppText className="text-white font-semibold">Xem bản đồ</AppText>
                </TouchableOpacity>
            </View>

            <AppText className="text-neutral-400 mt-2 text-center">{locationLabel}</AppText>
        </View>
    );
};

export default MapCard;
