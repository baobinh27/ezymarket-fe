import IButton from "@/components/IButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import styles from "./auth.styles";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // TODO: Kết nối API register/verify-email khi backend sẵn sàng
  const handleRegister = async () => {
    if (!email || !username || !password || password !== confirmPassword) return;
    // Gọi API đăng ký ở đây
    alert("Registered! Please check your email to verify your account.");
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/EzyMarketLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>EzyMarket</Text>
        <Text style={styles.subtitle}>Create an account</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="default"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
        <View style={styles.inputPasswordRow}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            style={styles.passwordIconButton}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#9CA3AF"
            />
          </Pressable>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Confirm password</Text>
        <View style={styles.inputPasswordRow}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Confirm your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Pressable
            style={styles.passwordIconButton}
            onPress={() => setShowConfirmPassword((prev) => !prev)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#9CA3AF"
            />
          </Pressable>
        </View>

        <IButton
          variant="primary"
          onPress={handleRegister}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </IButton>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account ?</Text>
          <Pressable onPress={() => router.push("/auth/login")}>
            <Text style={styles.bottomLink}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
