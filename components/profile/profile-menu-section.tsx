import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ProfileMenuItem } from '@/components/profile/profile-menu-item';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type ProfileMenuVariant = 'driver' | 'passenger';

export type ProfileMenuSectionProps = {
  variant: ProfileMenuVariant;
  onProfilePress?: () => void;
  onVehiclePress?: () => void;
  onReportsPress?: () => void;
  onPersonalDataPress?: () => void;
  onDependentsPress?: () => void;
};

type SectionItem = {
  label: string;
  icon: 'person-outline' | 'directions-bus' | 'folder-open' | 'groups';
  onPress?: () => void;
};

type Section = {
  title: string;
  items: SectionItem[];
};

export function ProfileMenuSection({
  variant,
  onProfilePress,
  onVehiclePress,
  onReportsPress,
  onPersonalDataPress,
  onDependentsPress,
}: ProfileMenuSectionProps): ReactElement {
  const sections: Section[] =
    variant === 'driver'
      ? [
          {
            title: 'Editar',
            items: [
              {
                label: 'Perfil',
                icon: 'person-outline',
                onPress: onProfilePress,
              },
              {
                label: 'Veículo',
                icon: 'directions-bus',
                onPress: onVehiclePress,
              },
            ],
          },
          {
            title: 'Ver Métricas',
            items: [
              {
                label: 'Relatórios',
                icon: 'folder-open',
                onPress: onReportsPress,
              },
            ],
          },
        ]
      : [
          {
            title: 'Editar',
            items: [
              {
                label: 'Dados Pessoais',
                icon: 'person-outline',
                onPress: onPersonalDataPress,
              },
              {
                label: 'Dependentes',
                icon: 'groups',
                onPress: onDependentsPress,
              },
            ],
          },
        ];

  return (
    <View style={styles.wrapper}>
      {sections.map((section) => (
        <View key={section.title} style={styles.shadowContainer}>
          <View style={styles.sectionCard}>
            <View style={styles.header}>
              <Text style={styles.title}>{section.title}</Text>
            </View>

            <View style={styles.itemsContainer}>
              {section.items.map((item, index) => (
                <ProfileMenuItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  onPress={item.onPress}
                  isLast={index === section.items.length - 1}
                />
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
  },
  shadowContainer: {
    borderRadius: 16,
    backgroundColor: colors.light,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.light,
  },
  header: {
    backgroundColor: colors.light,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  itemsContainer: {
    backgroundColor: colors.accent,
    paddingBottom: 4,
  },
});
