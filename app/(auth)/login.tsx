
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
    }
    if (email == "admin@gmail.com" && password == "123456") {
      await login("dummy-token");
      router.replace("/(root)/home");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-black">
      <View className="items-center mb-10">
        <Image
          source={require("../../assets/images/logo.jpg")}
          className="w-60 h-40 rounded-3xl"
          resizeMode="cover"
        />
      </View>
      <View className="rounded-3xl p-6">
        <Text className="text-white text-lg font-semibold mb-2">Email</Text>
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

        <Text className="text-white text-lg font-semibold mb-2">Password</Text>

        <View className="bg-[#2B2B2B] rounded-xl flex-row items-center px-4 mb-4">
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#9CA3AF"
          />
          <TextInput
            className="flex-1 py-4 px-3 text-white"
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-violet-500 rounded-xl py-4 mt-4"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-400">
            Don't have an account?
          </Text>

          <Link href="/(auth)/register">
            <Text className="text-violet-500 font-bold">
              {" "}Sign Up
            </Text>
          </Link>
        </View>

      </View>
    </View>
  );
}