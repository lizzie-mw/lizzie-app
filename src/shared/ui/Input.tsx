import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { forwardRef } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, ...props }, ref) => {
    return (
      <View className="w-full">
        {label && (
          <Text className="text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-gray-50 text-gray-900
            border
            ${error ? 'border-red-500' : 'border-gray-200'}
            focus:border-primary-500
          `}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {error && (
          <Text className="text-sm text-red-500 mt-1">{error}</Text>
        )}
        {hint && !error && (
          <Text className="text-sm text-gray-500 mt-1">{hint}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
