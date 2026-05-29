import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal as RNModal,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type PeriodType = 'day' | 'week' | 'month';

export type SelectedDates = {
  startDate?: Date;
  endDate?: Date;
};

export type ReportDateFilterSelectorsProps = {
  visible: boolean;
  periodType: PeriodType;
  onDismiss: () => void;
  onConfirm: (dates: SelectedDates) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
};

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i);

export function ReportDateFilterSelectors(props: ReportDateFilterSelectorsProps) {
  if (props.periodType === 'day') return <DayPopup {...props} />;
  if (props.periodType === 'week') return <WeekPopup {...props} />;
  return <MonthPopup {...props} />;
}

function PopupShell({
  visible,
  onDismiss,
  children,
  width = 360,
}: {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={[styles.card, { maxWidth: width }]} onPress={() => {}}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

function DayPopup({
  visible,
  onDismiss,
  onConfirm,
  initialStartDate,
}: ReportDateFilterSelectorsProps) {
  const [date, setDate] = useState<Date | undefined>(initialStartDate);

  useEffect(() => {
    if (visible) setDate(initialStartDate);
  }, [visible, initialStartDate]);

  const titleDate = date ? `${date.getDate()} de ${MONTHS[date.getMonth()]}` : 'Selecione';

  return (
    <PopupShell visible={visible} onDismiss={onDismiss} width={360}>
      <View style={styles.dayHeader}>
        <Text style={styles.smallLabel}>Selecione o Dia</Text>
        <View style={styles.dayHeaderTitleRow}>
          <Text style={styles.dayTitle}>{titleDate}</Text>
          <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.dark} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.calendarWrapper}>
        <CustomCalendar selectedDate={date} onSelect={setDate} />
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => setDate(undefined)} style={styles.actionButton}>
          <Text style={styles.actionTextSecondary}>Limpar</Text>
        </Pressable>
        <View style={styles.actionsRight}>
          <Pressable onPress={onDismiss} style={styles.actionButton}>
            <Text style={styles.actionTextSecondary}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={() => date && onConfirm({ startDate: date })}
            style={styles.actionButton}
            disabled={!date}
          >
            <Text style={[styles.actionTextPrimary, !date && styles.actionTextDisabled]}>OK</Text>
          </Pressable>
        </View>
      </View>
    </PopupShell>
  );
}

function WeekPopup({
  visible,
  onDismiss,
  onConfirm,
  initialStartDate,
  initialEndDate,
}: ReportDateFilterSelectorsProps) {
  const [startText, setStartText] = useState(formatDateBR(initialStartDate));
  const [endText, setEndText] = useState(formatDateBR(initialEndDate));
  const [focused, setFocused] = useState<'start' | 'end' | null>('start');

  useEffect(() => {
    if (visible) {
      setStartText(formatDateBR(initialStartDate));
      setEndText(formatDateBR(initialEndDate));
      setFocused('start');
    }
  }, [visible, initialStartDate, initialEndDate]);

  const handleConfirm = () => {
    const start = parseDateBR(startText);
    const end = parseDateBR(endText);
    if (start && end) {
      onConfirm({ startDate: start, endDate: end });
    }
  };

  const canConfirm = useMemo(() => {
    const start = parseDateBR(startText);
    const end = parseDateBR(endText);
    return !!(start && end && end >= start);
  }, [startText, endText]);

  return (
    <PopupShell visible={visible} onDismiss={onDismiss} width={360}>
      <View style={styles.weekHeader}>
        <Text style={styles.smallLabel}>Selecione as Datas</Text>
        <View style={styles.weekTitleRow}>
          <Text style={styles.weekTitle}>Período</Text>
          <MaterialCommunityIcons name="calendar-blank-outline" size={24} color={colors.dark} />
        </View>
      </View>

      <View style={styles.weekInputsRow}>
        <DateInputField
          label="Data"
          value={startText}
          onChangeText={setStartText}
          focused={focused === 'start'}
          onFocus={() => setFocused('start')}
        />
        <DateInputField
          label="Data final"
          value={endText}
          onChangeText={setEndText}
          focused={focused === 'end'}
          onFocus={() => setFocused('end')}
        />
      </View>

      <View style={styles.actions}>
        <View />
        <View style={styles.actionsRight}>
          <Pressable onPress={onDismiss} style={styles.actionButton}>
            <Text style={styles.actionTextSecondary}>Cancelar</Text>
          </Pressable>
          <Pressable onPress={handleConfirm} style={styles.actionButton} disabled={!canConfirm}>
            <Text style={[styles.actionTextPrimary, !canConfirm && styles.actionTextDisabled]}>
              OK
            </Text>
          </Pressable>
        </View>
      </View>
    </PopupShell>
  );
}

function DateInputField({
  label,
  value,
  onChangeText,
  focused,
  onFocus,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
}) {
  return (
    <View style={styles.inputField}>
      <View style={[styles.inputBorder, focused && styles.inputBorderFocused]}>
        <View style={styles.inputLabelWrap}>
          <Text style={[styles.inputLabel, focused && styles.inputLabelFocused]}>{label}</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={(v) => onChangeText(maskDateBR(v))}
          onFocus={onFocus}
          placeholder="dd/mm/aaaa"
          placeholderTextColor={colors.subtleText}
          keyboardType="numeric"
          maxLength={10}
          style={styles.inputText}
        />
      </View>
    </View>
  );
}

function MonthPopup({
  visible,
  onDismiss,
  onConfirm,
  initialStartDate,
}: ReportDateFilterSelectorsProps) {
  const now = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    initialStartDate?.getMonth() ?? now.getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    initialStartDate?.getFullYear() ?? now.getFullYear(),
  );
  const [yearOpen, setYearOpen] = useState(false);

  useEffect(() => {
    if (!visible) setYearOpen(false);
  }, [visible]);

  const handleSelectMonth = (index: number) => {
    setSelectedMonth(index);
    onConfirm({ startDate: new Date(selectedYear, index, 1) });
  };

  return (
    <PopupShell visible={visible} onDismiss={onDismiss} width={300}>
      <View style={styles.monthHeader}>
        <Pressable style={styles.monthHeaderItem} onPress={() => setYearOpen(false)}>
          <Text style={styles.monthHeaderText}>{MONTHS[selectedMonth]}</Text>
          <MaterialCommunityIcons name="menu-down" size={20} color={colors.dark} />
        </Pressable>

        <Pressable style={styles.yearHeaderItem} onPress={() => setYearOpen((prev) => !prev)}>
          <Text style={styles.yearHeaderText}>{selectedYear}</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <ScrollView
        style={styles.monthList}
        contentContainerStyle={styles.monthListContent}
        showsVerticalScrollIndicator
      >
        {yearOpen
          ? YEARS.map((year) => {
              const isSelected = year === selectedYear;
              return (
                <Pressable
                  key={year}
                  style={[styles.listItem, isSelected && styles.listItemSelected]}
                  onPress={() => {
                    setSelectedYear(year);
                    setYearOpen(false);
                  }}
                >
                  <View style={styles.listItemCheck}>
                    {isSelected ? (
                      <MaterialCommunityIcons name="check" size={18} color={colors.dark} />
                    ) : null}
                  </View>
                  <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
                    {year}
                  </Text>
                </Pressable>
              );
            })
          : MONTHS.map((month, index) => {
              const isSelected = index === selectedMonth;
              return (
                <Pressable
                  key={month}
                  style={[styles.listItem, isSelected && styles.listItemSelected]}
                  onPress={() => handleSelectMonth(index)}
                >
                  <View style={styles.listItemCheck}>
                    {isSelected ? (
                      <MaterialCommunityIcons name="check" size={18} color={colors.dark} />
                    ) : null}
                  </View>
                  <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
                    {month}
                  </Text>
                </Pressable>
              );
            })}
      </ScrollView>
    </PopupShell>
  );
}

function CustomCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate?: Date;
  onSelect: (date: Date) => void;
}) {
  const [viewDate, setViewDate] = useState<Date>(selectedDate ?? new Date());

  useEffect(() => {
    if (selectedDate) setViewDate(selectedDate);
  }, [selectedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const today = useMemo(() => new Date(), []);
  const cells = useMemo(() => buildMonthCells(year, month), [year, month]);

  const monthLabel = `${MONTHS[month]} ${year}`;
  const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <View>
      <View style={styles.calHeader}>
        <Text style={styles.calMonthYear}>{monthLabel}</Text>
        <View style={styles.calNav}>
          <Pressable onPress={goPrev} style={styles.calNavBtn} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.dark} />
          </Pressable>
          <Pressable onPress={goNext} style={styles.calNavBtn} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.dark} />
          </Pressable>
        </View>
      </View>

      <View style={styles.calWeekRow}>
        {weekdays.map((w, i) => (
          <Text key={i} style={styles.calWeekday}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.calGrid}>
        {cells.map((cell, i) => {
          const selected = isSameDay(cell.date, selectedDate);
          const isToday = isSameDay(cell.date, today);
          return (
            <Pressable key={i} style={styles.calCell} onPress={() => onSelect(cell.date)}>
              <View
                style={[
                  styles.calDayCircle,
                  selected && styles.calDayCircleSelected,
                  isToday && !selected && styles.calDayCircleToday,
                ]}
              >
                <Text
                  style={[
                    styles.calDayText,
                    !cell.currentMonth && styles.calDayTextOther,
                    selected && styles.calDayTextSelected,
                    isToday && !selected && styles.calDayTextToday,
                  ]}
                >
                  {cell.day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function buildMonthCells(year: number, month: number) {
  const cells: { day: number; currentMonth: boolean; date: Date }[] = [];
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i),
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      currentMonth: true,
      date: new Date(year, month, i),
    });
  }
  let next = 1;
  while (cells.length < 42) {
    cells.push({
      day: next,
      currentMonth: false,
      date: new Date(year, month + 1, next),
    });
    next++;
  }
  return cells;
}

function isSameDay(a?: Date, b?: Date) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateBR(date?: Date): string {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function parseDateBR(value: string): Date | undefined {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return undefined;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm) - 1;
  const year = Number(yyyy);
  const date = new Date(year, month, day);
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return undefined;
  }
  return date;
}

function maskDateBR(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length >= 3) parts[1] = digits.slice(2, 4);
  if (digits.length >= 5) parts[2] = digits.slice(4, 8);
  return parts.filter(Boolean).join('/');
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: withAlpha(colors.dark, 0.45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.accent,
  },
  smallLabel: {
    ...typography.labelSmall,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 64,
    alignItems: 'center',
  },
  actionTextSecondary: {
    ...typography.labelLarge,
    color: colors.secondary,
    fontWeight: '500',
  },
  actionTextPrimary: {
    ...typography.labelLarge,
    color: colors.secondary,
    fontWeight: '700',
  },
  actionTextDisabled: {
    color: colors.subtleText,
  },

  // Day picker
  dayHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 32,
  },
  dayHeaderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dayTitle: {
    ...typography.header3,
    color: colors.dark,
    fontSize: 32,
    lineHeight: 36,
  },
  calendarWrapper: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  calMonthYear: {
    ...typography.body,
    color: colors.dark,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  calNav: {
    flexDirection: 'row',
    gap: 4,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calWeekRow: {
    flexDirection: 'row',
    paddingBottom: 6,
  },
  calWeekday: {
    ...typography.labelSmall,
    color: colors.text,
    width: `${100 / 7}%`,
    textAlign: 'center',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDayCircleSelected: {
    backgroundColor: colors.secondary,
  },
  calDayCircleToday: {
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  calDayText: {
    ...typography.body,
    color: colors.dark,
  },
  calDayTextOther: {
    color: colors.subtleText,
    opacity: 0.6,
  },
  calDayTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  calDayTextToday: {
    color: colors.secondary,
    fontWeight: '600',
  },

  // Week picker
  weekHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 24,
  },
  weekTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekTitle: {
    ...typography.header3,
    color: colors.dark,
    fontSize: 32,
    lineHeight: 36,
  },
  weekInputsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  inputField: {
    flex: 1,
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: colors.separator,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    height: 56,
    justifyContent: 'center',
  },
  inputBorderFocused: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  inputLabelWrap: {
    position: 'absolute',
    top: -8,
    left: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.white,
  },
  inputLabel: {
    ...typography.labelSmall,
    color: colors.text,
    fontSize: 12,
  },
  inputLabelFocused: {
    color: colors.secondary,
  },
  inputText: {
    ...typography.body,
    color: colors.dark,
    padding: 0,
    margin: 0,
    ...(Platform.OS === 'web' ? { outlineWidth: 0, outlineStyle: 'none' as any } : null),
  },

  // Month picker
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  monthHeaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthHeaderText: {
    ...typography.body,
    color: colors.dark,
    fontWeight: '500',
  },
  yearHeaderItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  yearHeaderText: {
    ...typography.body,
    color: colors.subtleText,
    fontWeight: '400',
  },
  monthList: {
    maxHeight: 320,
  },
  monthListContent: {
    paddingVertical: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  listItemSelected: {
    backgroundColor: withAlpha(colors.secondary, 0.18),
  },
  listItemCheck: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    ...typography.body,
    color: colors.dark,
    fontWeight: '400',
  },
  listItemTextSelected: {
    fontWeight: '500',
  },
});
