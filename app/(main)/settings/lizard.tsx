import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lizardQueries, lizardKeys, lizardApi } from '@/entities/lizard';
import { lizardSchema, type LizardFormData } from '@/features/register-lizard';
import { ImagePicker } from '@/features/upload-image';
import { Button, Input, Select, Loading } from '@/shared/ui';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS, GENDER_OPTIONS } from '@/shared/constants';
import { haptics } from '@/shared/lib';

export default function LizardSettingsScreen() {
  const queryClient = useQueryClient();
  const { data: lizard, isLoading } = useQuery(lizardQueries.me());

  const updateMutation = useMutation({
    mutationFn: (data: LizardFormData) =>
      lizardApi.updateLizard(lizard!.id, data),
    onSuccess: () => {
      haptics.success();
      queryClient.invalidateQueries({ queryKey: lizardKeys.me() });
      Alert.alert('저장 완료', '도마뱀 정보가 업데이트되었어요.');
    },
    onError: (error: Error) => {
      haptics.error();
      Alert.alert('저장 실패', error.message || '다시 시도해주세요.');
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LizardFormData>({
    resolver: zodResolver(lizardSchema),
    values: lizard
      ? {
          name: lizard.name,
          species: lizard.species,
          birth_date: lizard.birth_date || '',
          gender: lizard.gender as LizardFormData['gender'],
          personality: lizard.personality as LizardFormData['personality'],
        }
      : undefined,
  });

  const onSubmit = (data: LizardFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading || !lizard) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* 프로필 이미지 */}
        <View className="items-center mb-8">
          <ImagePicker
            lizardId={lizard.id}
            currentImageUrl={lizard.profile_image_url}
            lizardName={lizard.name}
            size="xl"
          />
          <Text className="text-sm text-gray-500 mt-2">
            탭하여 사진 변경
          </Text>
        </View>

        {/* 폼 */}
        <View className="gap-5">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="이름"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="species"
            render={({ field: { onChange, value } }) => (
              <Select
                label="종류"
                options={SPECIES_OPTIONS}
                value={value}
                onChange={onChange}
                error={errors.species?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="birth_date"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="생년월 (YYYY-MM)"
                placeholder="예: 2023-01"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.birth_date?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Select
                label="성별"
                options={GENDER_OPTIONS}
                value={value || undefined}
                onChange={onChange}
                error={errors.gender?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="personality"
            render={({ field: { onChange, value } }) => (
              <Select
                label="성격"
                options={PERSONALITY_OPTIONS}
                value={value || undefined}
                onChange={onChange}
                error={errors.personality?.message}
              />
            )}
          />
        </View>

        {/* 저장 버튼 */}
        <View className="mt-8">
          <Button
            size="lg"
            fullWidth
            loading={updateMutation.isPending}
            disabled={!isDirty}
            onPress={handleSubmit(onSubmit)}
          >
            저장하기
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
