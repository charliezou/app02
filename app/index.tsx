import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// 模拟 AI 生成诗歌的函数
const generatePoetry = (imageUri: string) => {
  // 这里应该是调用真实的 AI API
  // 现在返回模拟数据
  const poems = [
    {
      title: "春日偶成",
      content: "云淡风轻近午天，傍花随柳过前川。\n时人不识余心乐，将谓偷闲学少年。",
      author: "AI 创作"
    },
    {
      title: "山行",
      content: "远上寒山石径斜，白云生处有人家。\n停车坐爱枫林晚，霜叶红于二月花。",
      author: "AI 创作"
    },
    {
      title: "静夜思",
      content: "床前明月光，疑是地上霜。\n举头望明月，低头思故乡。",
      author: "AI 创作"
    },
    {
      title: "望庐山瀑布",
      content: "日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。",
      author: "AI 创作"
    },
    {
      title: "饮湖上初晴后雨",
      content: "水光潋滟晴方好，山色空蒙雨亦奇。\n欲把西湖比西子，淡妆浓抹总相宜。",
      author: "AI 创作"
    }
  ];
  return poems[Math.floor(Math.random() * poems.length)];
};

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 请求权限
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限请求", "需要访问相册权限才能选择图片");
    }
  };

  // 选择图片
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setGeneratedPoem(null);
    }
  };

  // 生成诗歌
  const handleGeneratePoetry = () => {
    if (!selectedImage) {
      Alert.alert("提示", "请先选择一张图片");
      return;
    }

    setIsLoading(true);
    // 模拟 API 调用延迟
    setTimeout(() => {
      const poem = generatePoetry(selectedImage);
      setGeneratedPoem(poem);
      setIsLoading(false);
    }, 1000);
  };

  // 保存诗歌
  const savePoem = async () => {
    if (!generatedPoem) return;

    try {
      const newPoem = {
        ...generatedPoem,
        imageUri: selectedImage,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
      };
      
      // 先获取已保存的诗歌
      const saved = await AsyncStorage.getItem("savedPoems");
      const savedPoems = saved ? JSON.parse(saved) : [];
      
      // 添加新诗歌到开头
      const updatedPoems = [newPoem, ...savedPoems];
      await AsyncStorage.setItem("savedPoems", JSON.stringify(updatedPoems));
      
      Alert.alert("成功", "诗歌已保存到收藏");
    } catch (error) {
      console.error("保存诗歌失败:", error);
      Alert.alert("错误", "保存诗歌失败，请重试");
    }
  };

  // 分享诗歌
  const sharePoem = async () => {
    if (!generatedPoem || !selectedImage) return;

    try {
      await Sharing.shareAsync(selectedImage, {
        dialogTitle: "分享诗歌",
        mimeType: "image/jpeg",
        UTI: "public.jpeg"
      });
    } catch (error) {
      console.error("分享失败:", error);
      Alert.alert("错误", "分享失败，请重试");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>诗画同源</Text>
        <Text style={styles.subtitle}>从图片中发现诗意</Text>

        {/* 图片上传区域 */}
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.imagePicker} 
            onPress={pickImage}
            disabled={isLoading}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            ) : (
              <>
                <Ionicons name="camera" size={60} color="#8FB996" />
                <Text style={styles.imagePickerText}>点击选择图片</Text>
                <Text style={styles.imagePickerSubtext}>从相册中选择一张图片，AI 将为您创作诗歌</Text>
              </>
            )}
          </TouchableOpacity>

          {selectedImage && (
            <TouchableOpacity 
              style={styles.generateButton} 
              onPress={handleGeneratePoetry}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.generateButtonText}>生成诗歌</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* 诗歌生成结果 */}
        {generatedPoem && (
          <View style={styles.poemSection}>
            <Text style={styles.poemTitle}>{generatedPoem.title}</Text>
            <Text style={styles.poemContent}>{generatedPoem.content}</Text>
            <Text style={styles.poemAuthor}>—— {generatedPoem.author}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={savePoem}>
                <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>收藏</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={sharePoem}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>分享</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  imageSection: {
    alignItems: "center",
  },
  imagePicker: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8FB996",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  imagePickerText: {
    fontSize: 18,
    color: "#8FB996",
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  generateButton: {
    backgroundColor: "#D4AF37", // 金色
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  poemSection: {
    marginTop: 40,
    padding: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poemTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 15,
  },
  poemContent: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  poemAuthor: {
    fontSize: 14,
    color: "#666666",
    textAlign: "right",
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
  },
  actionButton: {
    backgroundColor: "#8FB996", // 青绿色
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
