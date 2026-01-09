import { useLocalSearchParams } from 'expo-router';
import { ChatRoom } from '@/widgets/chat-room';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  if (!chatId) {
    return null;
  }

  return <ChatRoom chatId={chatId} />;
}
