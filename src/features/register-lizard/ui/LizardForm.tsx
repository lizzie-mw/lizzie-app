import { View, Text, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select } from '@/shared/ui';
import { SPECIES_OPTIONS, PERSONALITY_OPTIONS } from '@/shared/constants';
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
      morph: '',
      age_months: undefined,
      personality: undefined,
    },
  });

  const onSubmit = (data: LizardFormData) => {
    register(data);
  };

  return (
    <ScrollView
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
          name="morph"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="모프 (선택)"
              placeholder="예: 탱제린, 블리자드"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.morph?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="age_months"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="나이 (개월)"
              placeholder="개월 수로 입력하세요"
              keyboardType="numeric"
              value={value?.toString() || ''}
              onChangeText={(text) => {
                const num = parseInt(text, 10);
                onChange(isNaN(num) ? undefined : num);
              }}
              onBlur={onBlur}
              error={errors.age_months?.message}
              hint="예: 12개월 = 1살"
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
              value={value}
              onChange={onChange}
              error={errors.personality?.message}
            />
          )}
        />
      </View>

      <View className="mt-8">
        <Button
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
