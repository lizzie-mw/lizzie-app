import { Pressable, Text, Alert } from 'react-native';
import { haptics } from '@/shared/lib';
import { useCreateChat } from '../model/useCreateChat';

interface NewChatButtonProps {
  lizardId: string;
  chatCount: number;
  maxChats?: number;
}

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
    <Pressable
      className={`
        w-14 h-14 rounded-full items-center justify-center
        shadow-lg
        ${canCreate ? 'bg-primary-500' : 'bg-gray-300'}
      `}
      onPress={handlePress}
      disabled={isCreating}
    >
      <Text className="text-white text-2xl font-light">+</Text>
    </Pressable>
  );
}
