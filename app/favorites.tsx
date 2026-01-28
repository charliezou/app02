import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FavoritesPage() {
  const [savedPoems, setSavedPoems] = useState<any[]>([]);

  useEffect(() => {
    loadSavedPoems();
  }, []);

  const loadSavedPoems = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedPoems");
      if (saved) {
        setSavedPoems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("加载保存的诗歌失败:", error);
    }
  };

  const removeSavedPoem = async (id: string) => {
    try {
      const updatedPoems = savedPoems.filter((poem) => poem.id !== id);
      await AsyncStorage.setItem("savedPoems", JSON.stringify(updatedPoems));
      setSavedPoems(updatedPoems);
      Alert.alert("成功", "诗歌已从收藏中移除");
    } catch (error) {
      console.error("移除诗歌失败:", error);
      Alert.alert("错误", "移除诗歌失败，请重试");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>我的收藏</Text>
        
        {savedPoems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无收藏的诗歌</Text>
            <Text style={styles.emptySubtext}>您可以在首页生成诗歌后进行收藏</Text>
          </View>
        ) : (
          savedPoems.map((poem) => (
            <View key={poem.id} style={styles.poemCard}>
              <Image source={{ uri: poem.imageUri }} style={styles.poemImage} />
              <View style={styles.poemContent}>
                <Text style={styles.poemTitle}>{poem.title}</Text>
                <Text style={styles.poemText}>{poem.content}</Text>
                <Text style={styles.poemAuthor}>—— {poem.author}</Text>
                <View style={styles.poemFooter}>
                  <Text style={styles.poemDate}>
                    {new Date(poem.savedAt).toLocaleDateString()}
                  </Text>
                  <TouchableOpacity onPress={() => removeSavedPoem(poem.id)}>
                    <Text style={styles.removeButton}>移除</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC", // 米白色背景
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  poemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poemImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  poemContent: {
    flex: 1,
  },
  poemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  poemText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  poemAuthor: {
    fontSize: 14,
    color: "#666666",
    textAlign: "right",
    marginBottom: 10,
  },
  poemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  poemDate: {
    fontSize: 12,
    color: "#999999",
  },
  removeButton: {
    fontSize: 14,
    color: "#FF6B6B",
  },
});