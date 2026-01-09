import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { useState } from 'react';
import { haptics } from '@/shared/lib';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: readonly Option[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function Select({
  label,
  placeholder = '선택하세요',
  options,
  value,
  onChange,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    haptics.selection();
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}

      <Pressable
        className={`
          w-full px-4 py-3 rounded-xl
          bg-gray-50 border flex-row justify-between items-center
          ${error ? 'border-red-500' : 'border-gray-200'}
        `}
        onPress={() => {
          haptics.light();
          setIsOpen(true);
        }}
      >
        <Text
          className={selectedOption ? 'text-gray-900' : 'text-gray-400'}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Text className="text-gray-400">▼</Text>
      </Pressable>

      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[60%]">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-center">
                {label || '선택'}
              </Text>
            </View>
            <ScrollView className="p-2">
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  className={`
                    px-4 py-4 rounded-xl
                    ${value === option.value ? 'bg-primary-50' : ''}
                  `}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    className={`
                      text-base
                      ${value === option.value ? 'text-primary-600 font-medium' : 'text-gray-900'}
                    `}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View className="h-8" />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
