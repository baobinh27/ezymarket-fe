import IButton from "@/components/IButton";
import ConfirmDeleteGroupModal from "@/components/home/ConfirmDeleteGroupModal";
import { ItemCard, IText } from "@/components/styled";
import useAddMemberToGroup from "@/hooks/group/useAddMemberToGroup";
import useCreateGroup from "@/hooks/group/useCreateGroup";
import useDeleteGroup from "@/hooks/group/useDeleteGroup";
import useGetGroupDetails from "@/hooks/group/useGetGroupDetails";
import useGetMyGroups from "@/hooks/group/useGetMyGroups";
import useRemoveMemberFromGroup from "@/hooks/group/useRemoveMemberFromGroup";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { GroupDetails } from "@/types/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type GroupManagementModalProps = {
  visible: boolean;
  onClose: () => void;
};

const GroupManagementModal: React.FC<GroupManagementModalProps> = ({ visible, onClose }) => {
  const [tab, setTab] = useState<"list" | "create" | "manage">("list");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { showSnackBar } = useSnackBar();
  const {
    data: groupsData,
    isLoading: groupsLoading,
    refetch: refetchGroups,
  } = useGetMyGroups(visible);
  const {
    data: groupDetailsData,
    isLoading: detailsLoading,
    refetch: refetchGroupDetails,
  } = useGetGroupDetails(selectedGroupId, visible && tab === "manage");
  const { mutate: createGroupMutate, isPending: isCreating } = useCreateGroup();
  const { mutate: addMember, isPending: isAddingMember } = useAddMemberToGroup();
  const { mutate: removeMember } = useRemoveMemberFromGroup();
  const { mutate: deleteGroupMutate, isPending: isDeleting } = useDeleteGroup();

  const groups = groupsData?.groups || [];
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupDetails =
    groupDetailsData?.group ||
    ({
      id: "",
      description: "",
      memberCount: 0,
      name: "",
      owner: {
        _id: "",
        email: "",
      },
      members: [],
      createdAt: "",
      updatedAt: "",
    } as GroupDetails);

  useEffect(() => {
    console.log("groupDetailsData:", groupDetailsData);
  }, [groupDetailsData]);

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      showSnackBar("Group name is required", "error");
      return;
    }

    createGroupMutate(
      { name: groupName, description: groupDescription },
      {
        onSuccess: () => {
          showSnackBar("Group created successfully!", "success");
          setGroupName("");
          setGroupDescription("");
          setTab("list");
          refetchGroups();
        },
        onError: (error: any) => {
          showSnackBar(error?.response?.data?.message || "Failed to create group", "error");
          console.log("error:", error);
        },
      }
    );
  };

  const handleAddMember = () => {
    if (!selectedGroupId) {
      showSnackBar("Please select a group", "error");
      return;
    }
    if (!memberEmail.trim()) {
      showSnackBar("Member email is required", "error");
      return;
    }

    addMember(
      { groupId: selectedGroupId, userId: memberEmail },
      {
        onSuccess: () => {
          showSnackBar("Member added successfully!", "success");
          setMemberEmail("");
          refetchGroups();
          refetchGroupDetails();
        },
        onError: (error: any) => {
          showSnackBar(error?.response?.data?.message || "Failed to add member", "error");
        },
      }
    );
  };

  const handleRemoveMember = (groupId: string, userId: string) => {
    Alert.alert("Remove Member", "Are you sure you want to remove this member?", [
      { text: "Cancel", onPress: () => { } },
      {
        text: "Remove",
        onPress: () => {
          removeMember(
            { groupId, userId },
            {
              onSuccess: () => {
                showSnackBar("Member removed successfully!", "success");
                refetchGroups();
                refetchGroupDetails();
              },
              onError: (error: any) => {
                showSnackBar(error?.response?.data?.message || "Failed to remove member", "error");
              },
            }
          );
        },
        style: "destructive",
      },
    ]);
  };

  const handleDeleteGroup = () => {
    if (!selectedGroupId) return;

    deleteGroupMutate(selectedGroupId, {
      onSuccess: () => {
        showSnackBar("Group deleted successfully!", "success");
        setShowDeleteConfirm(false);
        setSelectedGroupId(null);
        setTab("list");
        refetchGroups();
      },
      onError: (error: any) => {
        showSnackBar(error?.response?.data?.message || "Failed to delete group", "error");
      },
    });
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.container}>
        {/* Delete Group Confirmation Modal */}
        <ConfirmDeleteGroupModal
          visible={showDeleteConfirm}
          groupName={selectedGroup?.name || ""}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteGroup}
          isLoading={isDeleting}
        />
        {/* Header */}
        <View style={styles.header}>
          <IText semiBold size={18}>
            Group Management
          </IText>
          <Pressable onPress={onClose}>
            <Feather name="x" size={24} color="#000" />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {(["list", "create", "manage"] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && styles.activeTab]}
              onPress={() => {
                setTab(t);
                if (t === "list") {
                  setSelectedGroupId(null);
                }
              }}
            >
              <IText semiBold size={12} color={tab === t ? "#82CD47" : "#999"}>
                {t === "list" ? "My Groups" : t === "create" ? "Create" : "Manage"}
              </IText>
            </Pressable>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentScroll}>
          {/* List Tab */}
          {tab === "list" && (
            <>
              {groupsLoading ? (
                <ActivityIndicator color="#82CD47" size="large" />
              ) : groups.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="account-group" size={48} color="#CCC" />
                  <IText size={14} color="#999">
                    No groups yet
                  </IText>
                </View>
              ) : (
                groups.map((group) => (
                  <ItemCard key={group.id} style={styles.groupCard}>
                    <View style={styles.groupInfo}>
                      <IText semiBold size={14}>
                        {group.name}
                      </IText>
                      <IText size={11} color="#666">
                        {group.description}
                      </IText>
                      <IText size={10} color="#999" style={{ marginTop: 4 }}>
                        {group.memberCount} member
                        {group.memberCount !== 1 ? "s" : ""}
                      </IText>
                    </View>
                    <IButton
                      variant="tertiary"
                      style={styles.manageButton}
                      onPress={() => {
                        setSelectedGroupId(group.id);
                        setTab("manage");
                      }}
                    >
                      <Feather name="arrow-right-circle" size={24} color="#82CD47" />
                    </IButton>
                  </ItemCard>
                ))
              )}
            </>
          )}

          {/* Create Tab */}
          {tab === "create" && (
            <View style={styles.formSection}>
              <View style={styles.formGroup}>
                <IText semiBold size={12} style={styles.label}>
                  Group Name
                </IText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter group name"
                  placeholderTextColor="#999"
                  value={groupName}
                  onChangeText={setGroupName}
                  editable={!isCreating}
                />
              </View>

              <View style={styles.formGroup}>
                <IText semiBold size={12} style={styles.label}>
                  Description
                </IText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter group description"
                  placeholderTextColor="#999"
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  multiline
                  numberOfLines={3}
                  editable={!isCreating}
                />
              </View>

              <IButton
                variant="primary"
                style={styles.submitButton}
                onPress={handleCreateGroup}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <IText semiBold color="white">
                    Create Group
                  </IText>
                )}
              </IButton>
            </View>
          )}

          {/* Manage Tab */}
          {tab === "manage" && (
            <>
              {selectedGroup && groupDetails ? (
                <View style={styles.formSection}>
                  <View style={styles.groupHeader}>
                    <View>
                      <IText semiBold size={16}>
                        {selectedGroup.name}
                      </IText>
                      <IText size={11} color="#666">
                        {selectedGroup.description}
                      </IText>
                    </View>
                  </View>

                  {/* Add Member Section */}
                  <View style={styles.divider} />

                  <View style={styles.formGroup}>
                    <IText semiBold size={12} style={styles.label}>
                      Add Member
                    </IText>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter user ID"
                      placeholderTextColor="#999"
                      value={memberEmail}
                      onChangeText={setMemberEmail}
                      keyboardType="email-address"
                      editable={!isAddingMember}
                    />
                  </View>

                  <IButton
                    variant="primary"
                    style={styles.submitButton}
                    onPress={handleAddMember}
                    disabled={isAddingMember}
                  >
                    {isAddingMember ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <IText semiBold color="white">
                        Add Member
                      </IText>
                    )}
                  </IButton>

                  {/* Members List */}
                  <View style={[styles.divider, { marginTop: 20 }]} />

                  <IText semiBold size={12} style={styles.label}>
                    Members ({groupDetails.members?.length || 0 + 1})
                  </IText>

                  <View style={styles.membersList}>
                    {/* Owner */}
                    <View style={styles.memberItem}>
                      <View style={styles.memberInfo}>
                        <IText semiBold size={12}>
                          {groupDetails.owner?.email ? groupDetails.owner.email : ""}
                        </IText>
                        <IText size={10} color="#999">
                          Owner
                        </IText>
                      </View>
                      <MaterialCommunityIcons name="crown" size={18} color="#FFD700" />
                    </View>

                    {/* Other Members */}
                    {groupDetails.members &&
                      groupDetails.members.map((member) => {
                        if (member.email === groupDetails.owner?.email) return null;
                        return (
                          <View key={member._id} style={styles.memberItem}>
                            <View style={styles.memberInfo}>
                              <IText semiBold size={12}>
                                {member.email}
                              </IText>
                              <IText size={10} color="#999">
                                Member
                              </IText>
                            </View>
                            <Pressable
                              onPress={() => {
                                if (selectedGroupId) {
                                  handleRemoveMember(selectedGroupId, member._id);
                                }
                              }}
                            >
                              <MaterialCommunityIcons
                                name="close-circle"
                                size={18}
                                color="#FF6B6B"
                              />
                            </Pressable>
                          </View>
                        );
                      })}
                  </View>
                  <IButton
                    variant="none"
                    style={styles.deleteGroupButton}
                    onPress={() => setShowDeleteConfirm(true)}
                  >
                    <IText color="#FF6B6B" semiBold>
                      Delete group
                    </IText>
                  </IButton>
                </View>
              ) : detailsLoading ? (
                <ActivityIndicator color="#82CD47" size="large" />
              ) : (
                <View style={styles.emptyState}>
                  <IText size={12} color="#999">
                    Select a group to manage
                  </IText>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 40,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "85%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#82CD47",
  },
  content: {
    flex: 1,
  },
  contentScroll: {
    padding: 16,
    gap: 12,
  },
  groupCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  groupInfo: {
    flex: 1,
  },
  manageButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  formSection: {
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    paddingHorizontal: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
  },
  textArea: {
    textAlignVertical: "top",
    paddingTop: 10,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  groupHeader: {
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
  },
  membersList: {
    gap: 10,
    marginTop: 12,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  memberInfo: {
    flex: 1,
  },
  deleteGroupButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
});

export default GroupManagementModal;
