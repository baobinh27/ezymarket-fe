import IButton from "@/components/IButton";
import { useRegisterVerify } from "@/hooks/auth/useForgotPassword";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import styles from "./auth.styles";

export default function RegisterVerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);

  const inputsRef = useRef<(TextInput | null)[]>([]);

  const code = useMemo(() => digits.join(""), [digits]);

  const { mutateAsync: verifyEmail, isPending } = useRegisterVerify();
  const { showSnackBar } = useSnackBar();

  const handleChangeDigit = (value: string, index: number) => {
    const char = value.slice(-1);

    // Delete current digit → clear and jump to previous input
    if (value === "") {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      return;
    }

    // Only accept 0-9
    if (!/^[0-9]$/.test(char)) {
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = char;
    setDigits(nextDigits);

    // Auto jump to next input
    if (index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6 || submitting) return;
    if (!email) {
      showSnackBar("Something went wrong. Please try again.", "error");
      return;
    }

    try {
      setSubmitting(true);
      await verifyEmail({ email, otp: code });
      showSnackBar("Email verified successfully!", "success");
      router.replace("/auth/login");
    } catch (e: any) {
      showSnackBar(e.message || "Verification failed. Please try again.", "error");
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
        <Text style={styles.subtitleMain}>Verify Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit verification code sent to your email. The code expires in 10 minutes.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Verification code</Text>
        <View style={styles.otpRow}>
          {digits.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChangeDigit(v, idx)}
            />
          ))}
        </View>

        <IButton variant="primary" onPress={handleVerify} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{submitting ? "Verifying..." : "Verify"}</Text>
        </IButton>

        <Pressable style={styles.backWrapper} onPress={() => router.replace("/auth/register")}>
          <Text style={styles.backText}>Want to change email? Go back to register</Text>
        </Pressable>
      </View>
    </View>
  );
}
