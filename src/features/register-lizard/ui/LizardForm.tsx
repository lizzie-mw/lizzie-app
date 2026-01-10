import { View, Text, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select } from '@/shared/ui';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS, GENDER_OPTIONS } from '@/shared/constants';
import { lizardSchema, type LizardFormData } from '../model/lizardSchema';
import { useRegisterLizard } from '../model/useRegisterLizard';

export function LizardForm() {
  const { register, isRegistering } = useRegisterLizard({
    onError: (error) => {
      Alert.alert('등록 실패', error.message || '도마뱀 등록에 실패했어요.');
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LizardFormData>({
    resolver: zodResolver(lizardSchema),
    defaultValues: {
      name: '',
      species: undefined,
      birth_date: '',
      gender: undefined,
      personality: undefined,
    },
  });

  const onSubmit = (data: LizardFormData) => {
    register(data);
  };

  return (
    <ScrollView
      testID="lizard-form"
      className="flex-1"
      contentContainerClassName="p-6"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-2xl font-bold text-gray-900 mb-2">
        도마뱀 등록
      </Text>
      <Text className="text-gray-500 mb-8">
        함께할 도마뱀 친구를 소개해주세요
      </Text>

      <View className="gap-5">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              testID="input-lizard-name"
              label="이름 *"
              placeholder="도마뱀 이름을 입력하세요"
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
              testID="select-species"
              label="종류 *"
              placeholder="종류를 선택하세요"
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
              testID="input-birth-date"
              label="생년월 *"
              placeholder="YYYY-MM 형식으로 입력하세요"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.birth_date?.message}
              hint="예: 2023-01"
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <Select
              label="성별 (선택)"
              placeholder="성별을 선택하세요"
              options={GENDER_OPTIONS}
              value={value ?? undefined}
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
              label="성격 (선택)"
              placeholder="성격을 선택하세요"
              options={PERSONALITY_OPTIONS}
              value={value ?? undefined}
              onChange={onChange}
              error={errors.personality?.message}
            />
          )}
        />
      </View>

      <View className="mt-8">
        <Button
          testID="button-register-lizard"
          size="lg"
          fullWidth
          loading={isRegistering}
          onPress={handleSubmit(onSubmit)}
        >
          등록하기
        </Button>
      </View>
    </ScrollView>
  );
}
