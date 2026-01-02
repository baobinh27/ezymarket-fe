import IButton from "@/components/IButton";
import { ItemCard, IText } from "@/components/styled";
import useGetReportOverview from "@/hooks/report/useGetReportOverview";
import { useAuth } from "@/services/auth/auth.context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function HomeScreen() {
  const auth = useAuth();
  const {
    data: reportData,
    isLoading,
    isError,
    error,
  } = useGetReportOverview();

  useEffect(() => {
    console.log("report data:", reportData);
  }, [reportData]);

  useEffect(() => {
    if (isError) console.log(error);
  }, [isError, error]);

  const handleLogout = async () => {
    await auth.logout();
  };

  const quickAccessButtons = [
    {
      icon: "fridge",
      label: "Fridge",
      onPress: () => router.push("/(app)/fridge"),
      color: "#82CD47",
    },
    {
      icon: "pot-steam",
      label: "Meals",
      onPress: () => router.push("/(app)/meals/planning"),
      color: "#FFA500",
    },
    {
      icon: "shopping",
      label: "Shopping",
      onPress: () => router.push("/(app)/shopping"),
      color: "#FF6B9D",
    },
    {
      icon: "book-open",
      label: "Recipes",
      onPress: () => router.push("/(app)/profile/dictionary"),
      color: "#9B59B6",
    },
  ];

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <ItemCard style={styles.statCard}>
      <View
        style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}
      >
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.statContent}>
        <IText size={10} color="#666666">
          {label}
        </IText>
        <IText semiBold size={14}>
          {value}
        </IText>
      </View>
    </ItemCard>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section with Image and Gradient */}
      <View style={styles.heroContainer}>
        <Image
          source={require("@/assets/images/fridge-illustration.jpg")}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255, 255, 255, 0.3)",
            "rgba(255, 255, 255, 1)",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IText semiBold size={20}>
            Welcome!
          </IText>
          <IText size={11} color="#666666">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </IText>
        </View>

        {/* Quick Access Buttons */}
        <View style={styles.quickAccessSection}>
          <IText semiBold size={14} style={styles.sectionTitle}>
            Quick Access
          </IText>
          <View style={styles.quickAccessGrid}>
            {quickAccessButtons.map((btn) => (
              <IButton
                key={btn.label}
                variant="tertiary"
                onPress={btn.onPress}
                style={styles.quickAccessButton}
              >
                <View
                  style={[
                    styles.quickAccessButtonContent,
                    // { borderColor: btn.color },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={btn.icon as any}
                    size={24}
                    // color="#82CD47"
                    color="#00000077"
                    // color={btn.color}
                  />
                  <IText size={11} semiBold style={{ marginTop: 3 }}>
                    {btn.label}
                  </IText>
                </View>
              </IButton>
            ))}
          </View>
        </View>

        {/* Dashboard Section */}
        <View style={styles.dashboardSection}>
          <IText semiBold size={14} style={styles.sectionTitle}>
            Overview
          </IText>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#82CD47" />
            </View>
          ) : isError ? (
            <ItemCard style={styles.errorCard}>
              <IText color="#FF6B6B">Failed to load overview</IText>
            </ItemCard>
          ) : reportData ? (
            <>
              {/* Fridge Stats */}
              <View style={styles.statsGroup}>
                <IText
                  semiBold
                  size={11}
                  color="#666666"
                  style={styles.groupLabel}
                >
                  Fridge
                </IText>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="package-variant"
                    label="Total Items"
                    value={reportData.fridgeStats.totalItems}
                    color="#82CD47"
                  />
                  <StatCard
                    icon="alert-circle"
                    label="Expired"
                    value={reportData.fridgeStats.expired}
                    color="#FF6B6B"
                  />
                </View>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="clock-alert"
                    label="Expiring Soon"
                    value={reportData.fridgeStats.expiringSoon}
                    color="#FFA500"
                  />
                  <StatCard
                    icon="cash"
                    label="Total Value"
                    value={`${reportData.fridgeStats.totalValue.toLocaleString('en-us')} ₫`}
                    color="#4CAF50"
                  />
                </View>
              </View>

              {/* Recipe Stats */}
              <View style={styles.statsGroup}>
                <IText
                  semiBold
                  size={11}
                  color="#666666"
                  style={styles.groupLabel}
                >
                  Recipes
                </IText>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="book-multiple"
                    label="Total Recipes"
                    value={reportData.recipeStats.totalRecipes}
                    color="#9B59B6"
                  />
                  <StatCard
                    icon="pencil"
                    label="Personal"
                    value={reportData.recipeStats.personalRecipes}
                    color="#3498DB"
                  />
                </View>
              </View>

              {/* Meal Plan Stats */}
              <View style={styles.statsGroup}>
                <IText
                  semiBold
                  size={11}
                  color="#666666"
                  style={styles.groupLabel}
                >
                  Meal Plans
                </IText>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="calendar-check"
                    label="This Week"
                    value={reportData.mealPlanStats.thisWeek}
                    color="#FF6B9D"
                  />
                  <StatCard
                    icon="percent"
                    label="Completion"
                    value={`${reportData.mealPlanStats.completionRate.toFixed(
                      0
                    )}%`}
                    color="#82CD47"
                  />
                </View>
              </View>

              {/* Shopping Stats */}
              <View style={styles.statsGroup}>
                <IText
                  semiBold
                  size={11}
                  color="#666666"
                  style={styles.groupLabel}
                >
                  Shopping Lists
                </IText>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="shopping-outline"
                    label="Active Lists"
                    value={reportData.shoppingStats.activeLists}
                    color="#FF6B9D"
                  />
                  <StatCard
                    icon="check-circle"
                    label="Completed"
                    value={reportData.shoppingStats.completedLists}
                    color="#4CAF50"
                  />
                </View>
              </View>
            </>
          ) : null}
        </View>

        {/* Logout Button */}
        <IButton
          variant="secondary"
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <IText semiBold color="white">
            Log Out
          </IText>
        </IButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  heroContainer: {
    width: "100%",
    height: 280,
    position: "relative",
    marginBottom: -100,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
    paddingBottom: 32,
    // backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    marginBottom: 4,
  },
  quickAccessSection: {
    gap: 8,
  },
  sectionTitle: {
    marginBottom: 2,
  },
  quickAccessGrid: {
    flexDirection: "row",
    // flexWrap: "wrap",
    width: "100%",
    // gap: 10,
    justifyContent: "space-between",
  },
  quickAccessButton: {
    width: "23%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickAccessButtonContent: {
    // padding: 14,
    // borderRadius: 12,
    // borderWidth: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#F5F5F5",
  },
  dashboardSection: {
    gap: 8,
  },
  statsGroup: {
    gap: 6,
  },
  groupLabel: {
    paddingHorizontal: 4,
    marginTop: 2,
    fontSize: 11,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statContent: {
    flex: 1,
    gap: 1,
  },
  loadingContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  errorCard: {
    padding: 16,
    backgroundColor: "#FFE5E5",
  },
  logoutButton: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
