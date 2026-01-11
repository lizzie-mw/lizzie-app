import { Pressable, Alert } from 'react-native';
import Animated from 'react-native-reanimated';
import { haptics, usePressAnimation } from '@/shared/lib';
import { Icon } from '@/shared/ui';
import { useCreateChat } from '../model/useCreateChat';

interface NewChatButtonProps {
  lizardId: string;
  chatCount: number;
  maxChats?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NewChatButton({
  lizardId,
  chatCount,
  maxChats = 5,
}: NewChatButtonProps) {
  const { createChat, isCreating } = useCreateChat(lizardId, {
    onError: (error) => {
      Alert.alert('오류', error.message || '채팅방 생성에 실패했어요.');
    },
  });

  const canCreate = chatCount < maxChats;
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

  const handlePress = () => {
    if (!canCreate) {
      haptics.warning();
      Alert.alert(
        '채팅방 제한',
        `최대 ${maxChats}개의 채팅방만 만들 수 있어요.`
      );
      return;
    }

    haptics.light();
    createChat();
  };

  return (
    <AnimatedPressable
      testID="fab-new-chat"
      style={animatedStyle}
      className={`
        w-16 h-16 rounded-full items-center justify-center
        shadow-xl
        ${canCreate ? 'bg-primary-500' : 'bg-gray-300'}
      `}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isCreating}
    >
      <Icon
        name="add"
        size="lg"
        color="#ffffff"
      />
    </AnimatedPressable>
  );
}
