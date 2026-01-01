import IButton from "@/components/IButton";
import { useForgotPasswordRequest } from "@/hooks/auth/useForgotPassword";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import styles from "./auth.styles";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const { showSnackBar } = useSnackBar();
  const { mutateAsync: sendForgotPasswordRequest, isPending } = useForgotPasswordRequest();

  // TODO: Kết nối API forgot-password của backend khi sẵn sàng
  const handleSubmit = async () => {
    if (!email || isPending) return;
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      showSnackBar("Invalid email!", "error");
      return;
    }
    try {
      await sendForgotPasswordRequest({ email });
      router.push({
        pathname: "/auth/forgot-password-code",
        params: { email: email },
      });
    } catch (e) {
      showSnackBar(`${e}`, "error");
    }
  };

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
        <Text style={styles.subtitle}>Enter your email</Text>
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

        <IButton variant="primary" onPress={handleSubmit} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{isPending ? "Sending..." : "Confirm"}</Text>
        </IButton>

        <Pressable style={styles.backWrapper} onPress={() => router.replace("/auth/login")}>
          <Text style={styles.backText}>Back to Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}
