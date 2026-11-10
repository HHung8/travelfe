import { getStatusMeta } from '@/src/utils/bookingStatus';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";

const STATUS_ICON: Record<string, any> = {
    pending: "time-outline",
    confirm: "checkmark-circle-outline",
    completed: "trophy-outline",
    cancelled: "close-circle-outline"
}

const StatusBanner = ({status}: {status: string}) => {
  const meta = getStatusMeta(status);
  return (
    <View style={{ backgroundColor: meta.badgeColor }} className="rounded-2xl p-4 flex-row items-center">
      <Ionicons name={STATUS_ICON[status] ?? "information-circle-outline"} size={22} color={meta.badgeText} />
      <AppText style={{ color: meta.badgeText }} className="font-bold text-base ml-2">{meta.label}</AppText>
    </View>
  );
}

export default StatusBanner