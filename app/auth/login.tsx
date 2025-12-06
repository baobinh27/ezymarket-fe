import IButton from "@/components/IButton";
import { useAuth } from "@/services/auth/auth.context";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import styles from "./auth.styles";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { showSnackBar } = useSnackBar();

  const handleLogin = async () => {
    if (submitting) return;
    if (!username || !password) {
      showSnackBar("Please enter your credentials.", 'warning');
      return;
    }
    try {
      setSubmitting(true);
      const { success, message } = await login(username.trim(), password);
      showSnackBar(message, success ? 'success' : 'error');
      if (success) router.replace("/");
    } finally {
      setSubmitting(false);
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
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
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

        <Pressable
          style={styles.forgotWrapper}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <IButton
          variant="primary"
          onPress={handleLogin}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </IButton>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don&apos;t have an account ?</Text>
          <Pressable onPress={() => router.push("/auth/register")}>
            <Text style={styles.bottomLink}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
