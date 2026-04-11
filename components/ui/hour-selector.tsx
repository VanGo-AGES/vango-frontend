import { useMemo, useState } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { AppTextField } from '@/components/app-text-field';
import { colors } from '@/styles/colors';

export interface HourSelectorProps {
  value: string;
  onChange: (value: string) => void;
  showError?: boolean;
  style?: StyleProp<ViewStyle>;
  label?: string;
}

function format_time(hours: number, minutes: number) {
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
}

function parse_time(value: string) {
  const [hours, minutes] = value.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return { hours: 0, minutes: 0 };
  }

  return { hours, minutes };
}

export function HourSelector({
  value,
  onChange,
  showError = false,
  style,
  label = 'Horário de Chegada',
}: HourSelectorProps) {
  const [visible, set_visible] = useState(false);

  const parsed_time = useMemo(() => parse_time(value), [value]);

  const has_error = showError && value.trim() === '';

  const handle_dismiss = () => {
    set_visible(false);
  };

  const handle_confirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    onChange(format_time(hours, minutes));
    set_visible(false);
  };

  return (
    <View style={style}>
      <Pressable onPress={() => set_visible(true)}>
        <View pointerEvents="none">
          <AppTextField
            label={label}
            value={value}
            placeholder="00:00"
            error={(has_error ? 'O horário não pode estar vazio' : undefined) as never}
            editable={false}
            right={
              has_error ? (
                <TextInput.Icon icon="alert-circle" color={colors.destructive} />
              ) : undefined
            }
          />
        </View>
      </Pressable>

      <TimePickerModal
        visible={visible}
        onDismiss={handle_dismiss}
        onConfirm={handle_confirm}
        hours={parsed_time.hours}
        minutes={parsed_time.minutes}
        use24HourClock
        locale="pt-BR"
        label={label}
        cancelLabel="Cancelar"
        confirmLabel="Confirmar"
      />
    </View>
  );
}
