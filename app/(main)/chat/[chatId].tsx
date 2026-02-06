import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChatRoom } from '@/widgets/chat-room';
import { lizardQueries } from '@/entities/lizard';
import { withParticle } from '@/shared/lib';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const navigation = useNavigation();
  const { data: lizard } = useQuery(lizardQueries.me());

  useEffect(() => {
    if (lizard?.name) {
      navigation.setOptions({
        title: `${lizard.name}${withParticle(lizard.name, '와', '과')}의 대화`,
      });
    }
  }, [lizard?.name, navigation]);

  if (!chatId) {
    return null;
  }

  return <ChatRoom chatId={chatId} />;
}
