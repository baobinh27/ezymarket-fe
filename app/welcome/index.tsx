import IButton from "@/components/IButton";
import { localStorage } from "@/utils/storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import styles from "./welcome.styles";

const slides = [
  {
    id: 1,
    title: "Welcome to\nEzyMarket",
    description: "A complete solution for everyday tasks!",
  },
  {
    id: 2,
    title: "Welcome to\nEzyMarket",
    description: "Create and track your own shopping lists!",
  },
  {
    id: 3,
    title: "Welcome to\nEzyMarket",
    description: "See what's inside your fridge today!",
  },
  {
    id: 4,
    title: "Welcome to\nEzyMarket",
    description: "Explore thousands of meals around the world!",
  },
  {
    id: 5,
    title: "Welcome to\nEzyMarket",
    description: "Better access with your family and relatives!",
  },
];

export default function WelcomeScreen() {
  const [index, setIndex] = useState(0);

  // Tự động chuyển slide sau 5s
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setIndex((prev) => (prev + 1) % slides.length);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, []);

  const handleFinishWelcome = async () => {
    await localStorage.set("hasShownWelcomePage", true);
    router.replace("/auth/login");
  };

  const handleNext = () => {
    if (index === slides.length - 1) {
      handleFinishWelcome();
    } else {
      setIndex((prev) => (prev + 1) % slides.length);
    }
  };

  const current = slides[index];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Welcome to</Text>
        <Text style={styles.title}>EzyMarket</Text>
        <Text style={styles.description}>{current.description}</Text>

        <View style={styles.logoWrapper}>
          <Image
            source={require("@/assets/images/EzyMarketLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.dotsRow}>
          {slides.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.dot,
                i === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <IButton
          variant="primary"
          onPress={handleNext}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {index === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </IButton>

        <Pressable onPress={handleFinishWelcome} style={styles.skipWrapper}>
          <Text style={styles.skipText}>skip welcome page</Text>
        </Pressable>
      </View>
    </View>
  );
}