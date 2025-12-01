import IButton from "@/components/IButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { authStyles as styles } from "./auth.styles";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // TODO: Kết nối API đặt lại mật khẩu mới khi backend sẵn sàng
  const handleConfirm = async () => {
    if (!password || !confirmPassword || password !== confirmPassword || submitting) {
      return;
    }
    try {
      setSubmitting(true);
      // await resetPasswordApi({ password, confirmPassword });
      router.replace("/auth/login");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled =
    !password || !confirmPassword || password !== confirmPassword || submitting;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/welcome")}>
          <Image
            source={require("@/assets/images/EzyMarketLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>
        <Text style={styles.title}>EzyMarket</Text>
        <Text style={styles.subtitleMain}>Forget Password</Text>
        <Text style={styles.subtitle}>Enter your new password</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputPasswordRow}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Enter your new password"
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
            placeholder="Confirm your new password"
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
          onPress={handleConfirm}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Saving..." : "Confirm"}
          </Text>
        </IButton>
      </View>
    </View>
  );
}
