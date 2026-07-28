import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const [selected, setSelected] = useState("card");
const methods = [
    {id: "card",icon: "card-outline",title: "Thẻ"},
    {id: "apple",icon: "logo-apple",title: "Apple Pay"},
    {id: "wallet",icon: "wallet-outline",title: "Ví điện tử"}
]

const PaymentMethod = () => {
    return (
        <View className='mx-6 mt-6'>
            <Text className='text-white font-bold mb-4'>Phương thức thanh toán</Text>
            <View className='flex-row justify-between'>
                {methods.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={()=>setSelected(item.id)}
                        className={`w-[31%] rounded-xl py-4 items-center border ${
                        selected===item.id
                        ?"border-[#6D5DF6] bg-[#44456B]"
                        :"border-[#555]"
                    }`}
                    >
                        <Ionicons name={item.icon as any} size={22} color="white" />
                        <Text className='text-white mt-2'>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default PaymentMethod