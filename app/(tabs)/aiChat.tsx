import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
// import { prompt } from "@/assets/prompt";

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-70b-8192';

// const templatePrompt = [
// 	{
// 		role: "system",
// 		content: prompt,
// 	},
// ];

const Message = ({ message, isUser, timestamp }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : {},
      ]}
    >
      {!isUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient colors={['#4a69bd', '#6a89cc']} style={styles.avatar}>
            <Text style={styles.avatarText}>AI</Text>
          </LinearGradient>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[styles.messageText, isUser ? styles.userText : styles.aiText]}
        >
          {message.content}
        </Text>
        <Text style={styles.timestampText}>{formattedTime}</Text>
      </View>
    </View>
  );
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    loadApiKey();
    loadConversationHistory();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory();
    }
  }, [messages]);

  const loadApiKey = async () => {
    try {
      const key = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
      if (key) {
        setApiKey(key);
      } else {
        const storedKey = apiKey;
        if (storedKey) {
          setApiKey(storedKey);
        } else {
          setShowApiKeyInput(true);
        }
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      setShowApiKeyInput(true);
    }
  };

  const saveApiKey = async (key) => {
    try {
      await AsyncStorage.setItem('groq_api_key', key);
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  };

  const loadConversationHistory = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('conversation_history');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([
          {
            role: 'assistant',
            content:
              "Hi there! I'm your AI assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      setMessages([
        {
          role: 'assistant',
          content: "Hi there! I'm your AI assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const saveConversationHistory = async () => {
    try {
      await AsyncStorage.setItem(
        'conversation_history',
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !apiKey) return;

    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const recentMessages = [...messages, userMessage].slice(-10);

      const contextMessages = [
        // ...templatePrompt,
        ...recentMessages.map(({ role, content }) => ({ role, content })),
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: contextMessages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error communicating with Groq');
      }

      const aiMessage = {
        ...data.choices[0].message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi there! I'm your AI assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const saveKeyAndCloseSettings = (key) => {
    setApiKey(key);
    saveApiKey(key);
    setShowApiKeyInput(false);
  };

  if (showApiKeyInput) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4a69bd" />
        <LinearGradient
          colors={['#4a69bd', '#6a89cc']}
          style={styles.apiKeyContainer}
        >
          <View style={styles.apiKeyForm}>
            <Text style={styles.title}>Welcome to AI Chatbot</Text>
            <Text style={styles.subtitle}>
              Please enter your Groq API key to continue
            </Text>
            <TextInput
              style={styles.apiKeyInput}
              placeholder="Enter your Groq API key"
              placeholderTextColor="#a4b0be"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveKeyAndCloseSettings(apiKey)}
            >
              <Text style={styles.saveButtonText}>Continue</Text>
            </TouchableOpacity>
            <Text style={styles.apiKeyHelp}>
              You can get your API key from the Groq website.
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4a69bd" />

        <LinearGradient colors={['#4a69bd', '#6a89cc']} style={styles.header}>
          <Text style={styles.headerTitle}>AI Chatbot</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={resetConversation}
            >
              <Ionicons name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowApiKeyInput(true)}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Message
              message={item}
              isUser={item.role === 'user'}
              timestamp={item.timestamp}
            />
          )}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#a4b0be"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#4a69bd',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
    marginLeft: 'auto',
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    shadowColor: '#dcdde1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#2f3640',
  },
  timestampText: {
    fontSize: 10,
    color: '#a4b0be',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9eaed',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 14,
    borderRadius: 24,
    fontSize: 16,
    maxHeight: 120,
    color: '#2f3640',
    shadowColor: '#dcdde1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sendButton: {
    backgroundColor: '#4a69bd',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#4a69bd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  apiKeyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  apiKeyForm: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8fa6',
    textAlign: 'center',
    marginBottom: 24,
  },
  apiKeyInput: {
    width: '100%',
    backgroundColor: '#f5f6fa',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dcdde1',
    marginBottom: 20,
    color: '#2f3640',
  },
  saveButton: {
    backgroundColor: '#4a69bd',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  apiKeyHelp: {
    fontSize: 14,
    color: '#7f8fa6',
    textAlign: 'center',
  },
});
