import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IText } from "./styled";
interface ShoppingListProps {
  id: string;
  name: string;
  active?: boolean
}

 export default function ShoppingList({
    id,
    name,
    active
 } : ShoppingListProps) {
    const router = useRouter();
    const handleListPress = (listId: string, listName: string) => {
        router.push({
        pathname: "./(shopping)/[id]",
        params: { id: listId, name: listName },
        });
    };
    return (
        <TouchableOpacity
                onPress={() => handleListPress(id, name)}
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
            <View style={{ 
                flexDirection: 'row',
                alignItems: "center",
                gap: 10
                }}>
                <View style={{backgroundColor: "white", padding: 5, borderRadius: 4}}><Octicons size={32} name="checklist" color={active ? "#46982D" : "black"} /></View>
                <View style={{gap: 4}}>
                    <View style={{
                        flexDirection: 'row',
                        
                    }}>
                        {active && (<View style={styles.indicator}><IText size={10} color="#46982D">Active</IText></View>)}
                        <IText size={16} bold color={active ? "white" : "black"}>{name}</IText>
                        
                    </View>
                    
                    <IText size={10} color={active ? "white" : "black"}>18 Items, Oct 23</IText>
                </View>

            </View>
            
            <Octicons size={32} name="chevron-right" color={active ? "white" : "black"} />
        </TouchableOpacity>
  );
 }

 const styles = StyleSheet.create({
     indicator: {
        marginTop: 4,
        backgroundColor: "white",
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 8,
        marginRight: 4,
        alignSelf: 'flex-start',
     },
     
 });
 
