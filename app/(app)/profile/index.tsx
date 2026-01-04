import IButton from "@/components/IButton";
import { CardGroup, ItemCard, IText } from "@/components/styled";
import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import { useAuth } from "@/services/auth/auth.context";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Clipboard, ScrollView, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { logout } = useAuth();
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const { showSnackBar } = useSnackBar();

  const handleLogout = async () => {
    await logout();
  };

  const handleCopyId = async () => {
    if (currentUser?.id) {
      await Clipboard.setString(currentUser.id);
      showSnackBar("User ID copied to clipboard!", "success");
    }
  };

  const displayName = currentUser?.userName || currentUser?.id || "-";
  const displayEmail = currentUser?.email || "-";

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 32,
      }}
    >
      {/* User Info & Dictionary Group */}
      <CardGroup>
        {/* User Info Card */}
        <ItemCard primary style={{ minHeight: 80, justifyContent: "center" }}>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IText size={18} bold color="#46982D">
                  {displayName.charAt(0).toUpperCase()}
                </IText>
              </View>
              <View style={{ flex: 1, justifyContent: "center", marginLeft: 12 }}>
                <IText color="white" size={18} bold>
                  {displayName}
                </IText>
                <IText color="white" size={14} style={{ marginTop: 4 }}>
                  {displayEmail}
                </IText>
              </View>
              <TouchableOpacity
                onPress={handleCopyId}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  borderRadius: 6,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons name="content-copy" size={18} color="white" />
              </TouchableOpacity>
            </>
          )}
        </ItemCard>

        {/* Dictionary Card */}
        <ItemCard primary style={{ justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => router.push("/profile/dictionary")}
            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 12,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Octicons name="book" size={16} color="white" />
            </View>
            <View style={{ flex: 1, justifyContent: "center", marginLeft: 12 }}>
              <IText color="white" size={16} semiBold>
                Your items dictionary
              </IText>
            </View>
            <Octicons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </ItemCard>
      </CardGroup>

      {/* Logout Button */}
      <IButton
        variant="none"
        style={{
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 8,
          borderWidth: 1,
          borderColor: "#EF4444",
        }}
        onPress={handleLogout}
      >
        <IText semiBold color="#EF4444">
          Log Out
        </IText>
      </IButton>
    </ScrollView>
  );
}
