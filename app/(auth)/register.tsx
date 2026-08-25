import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
  const router = useRouter();
  const {register} = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }
    if(password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(fullName, email, password, phone);
      alert("Registration successful!");
      router.replace("/(root)/home");
    } catch(err:any) {
      alert(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo */}
          <View className="items-center">
            <Image
              source={require("../../assets/images/logo.jpg")}
              className="w-40 h-20 rounded-3xl"
              resizeMode="cover"
            />
          </View>

          {/* Register Card */}
          <View className="rounded-3xl p-6">
            {/* Full Name */}
            <Text className="text-white text-lg font-semibold mb-2">Full Name</Text>
            <View className="bg-[#2B2B2B] rounded-xl flex-row items-center px-4 mb-4">
              <Ionicons name="person-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-4 px-3 text-white"
                placeholder="Enter your full name"
                placeholderTextColor="#888"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Email */}
            <Text className="text-white text-lg font-semibold mb-2"> Email </Text>
            <View className="bg-[#2B2B2B] rounded-xl flex-row items-center px-4 mb-4">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-4 px-3 text-white"
                placeholder="Enter your email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone */}
            <Text className="text-white text-lg font-semibold mb-2">Phone</Text>
            <View className="bg-[#2B2B2B] rounded-xl flex-row items-center px-4 mb-4">
              <Ionicons name="call-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-4 px-3 text-white"
                placeholder="Enter your phone number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Password */}
            <Text className="text-white text-lg font-semibold mb-2">Password</Text>
            <View className="bg-[#2B2B2B] rounded-xl flex-row items-center px-4 mb-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-4 px-3 text-white"
                placeholder="Enter your password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text className="text-white text-lg font-semibold mb-2"> Confirm Password </Text>
            <View className="bg-[#2B2B2B] rounded-xl flex-row items-center px-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF"/>
              <TextInput
                className="flex-1 py-4 px-3 text-white"
                placeholder="Confirm your password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-violet-600 rounded-xl py-4 items-center mt-8"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg"> Create Account </Text>
              )}
            </TouchableOpacity>
            <View className="flex-row justify-center mt-8">
              <Text className="text-neutral-400">Already have an account?</Text>
              <Link href="/(auth)/login">
                <Text className="text-violet-400 font-bold">
                  {" "}Sign In
                </Text>
              </Link>
            </View>
          </View>
          {/* Divider */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen

