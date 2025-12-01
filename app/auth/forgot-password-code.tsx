import IButton from "@/components/IButton";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { authStyles as styles } from "./auth.styles";

export default function ForgotPasswordCodeScreen() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  const code = useMemo(() => digits.join(""), [digits]);

  const handleChangeDigit = (value: string, index: number) => {
    const char = value.slice(-1);

    // Xoá ký tự hiện tại → clear và nhảy về ô trước
    if (value === "") {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      return;
    }

    // Chỉ chấp nhận 0-9
    if (!/^[0-9]$/.test(char)) {
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = char;
    setDigits(nextDigits);

    // Tự động nhảy sang ô tiếp theo
    if (index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // TODO: Kết nối API verify mã OTP khi backend sẵn sàng
  const handleVerify = async () => {
    if (code.length !== 6 || submitting) return;
    try {
      setSubmitting(true);
      // await verifyForgotPasswordCodeApi({ code });
      router.push("/auth/reset-password");
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
        <Text style={styles.subtitleMain}>Forget Password</Text>
        <Text style={styles.subtitle}>
          Check your emails and enter the 6-digit verification code
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

        <IButton
          variant="primary"
          onPress={handleVerify}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Verifying..." : "Verify"}
          </Text>
        </IButton>

        <Pressable
          style={styles.backWrapper}
          onPress={() => router.replace("/auth/forgot-password")}
        >
          <Text style={styles.backText}>Email not received? Send another code</Text>
        </Pressable>
      </View>
    </View>
  );
}

