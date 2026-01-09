import { useState } from 'react';
import { View, TextInput, Pressable, Text, Keyboard } from 'react-native';
import { haptics } from '@/shared/lib';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
}: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    haptics.light();
    onSend(trimmed);
    setText('');
    Keyboard.dismiss();
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View className="flex-row items-end px-4 py-3 border-t border-gray-100 bg-white">
      <TextInput
        className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-base text-gray-900 max-h-32"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={setText}
        multiline
        editable={!disabled}
      />
      <Pressable
        className={`
          ml-2 w-10 h-10 rounded-full items-center justify-center
          ${canSend ? 'bg-primary-500' : 'bg-gray-200'}
        `}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Text className={canSend ? 'text-white' : 'text-gray-400'}>↑</Text>
      </Pressable>
    </View>
  );
}
