import { useState } from 'react';
import { View, TextInput, Pressable, Keyboard } from 'react-native';
import Animated from 'react-native-reanimated';
import { haptics, usePressAnimation } from '@/shared/lib';
import { Icon } from '@/shared/ui';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
}: ChatInputProps) {
  const [text, setText] = useState('');
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

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
    <View className="flex-row items-end px-4 py-3 border-t border-cream-200 bg-white">
      <TextInput
        className="flex-1 bg-cream-100 rounded-2xl px-4 py-3 text-base text-gray-900 max-h-32"
        placeholder={placeholder}
        placeholderTextColor="#c9b69e"
        value={text}
        onChangeText={setText}
        multiline
        editable={!disabled}
      />
      <AnimatedPressable
        style={animatedStyle}
        className={`
          ml-3 w-11 h-11 rounded-full items-center justify-center
          ${canSend ? 'bg-primary-500' : 'bg-earth-200'}
        `}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Icon
          name="send"
          size="sm"
          color={canSend ? '#ffffff' : '#c9b69e'}
        />
      </AnimatedPressable>
    </View>
  );
}
