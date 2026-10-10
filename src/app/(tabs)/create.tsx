import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { CustomInput } from '@/components/CustomInput';
import { Select, type SelectOption } from '@/components/Select';
import { getApiErrorMessage } from '@/services/api';
import { createTicket } from '@/services/resourceService';

import { DEPARTMENTS, PRIORITIES, RESPONSABLES } from '@/constants/config';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TicketInput } from '@/types/Entity';

const DEPARTMENT_OPTIONS: SelectOption[] = DEPARTMENTS.map((department) => ({
  label: department,
  value: department,
}));

const RESPONSABLE_OPTIONS: SelectOption[] = RESPONSABLES.map((responsable) => ({
  label: responsable,
  value: responsable,
}));

const INITIAL_FORM: TicketInput = {
  title: '',
  department: '',
  responsable: '',
  priority: 'Media',
  status: 'Abierto',
  description: '',
};

export default function CreateTicketScreen() {
  const theme = useTheme();
  const [form, setForm] = useState<TicketInput>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof TicketInput>(key: K, value: TicketInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.title.trim() ||
      !form.department ||
      !form.responsable ||
      !form.description.trim()
    ) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      await createTicket({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });
      Alert.alert('Ticket creado', 'La incidencia fue registrada correctamente.', [
        { text: 'Aceptar', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}>
        <CustomInput
          label="Título"
          placeholder="Describe el problema en una frase"
          value={form.title}
          onChangeText={(value) => setField('title', value)}
        />
        <Select
          label="Departamento"
          placeholder="Selecciona un departamento"
          value={form.department}
          options={DEPARTMENT_OPTIONS}
          onChange={(value) => setField('department', value)}
        />
        <Select
          label="Responsable"
          placeholder="Asigna un responsable"
          value={form.responsable}
          options={RESPONSABLE_OPTIONS}
          onChange={(value) => setField('responsable', value)}
        />
        <CustomInput
          label="Descripción"
          placeholder="Detalla el fallo..."
          value={form.description}
          onChangeText={(value) => setField('description', value)}
          multiline
          numberOfLines={4}
          style={styles.descriptionInput}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Prioridad</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((priority) => {
            const selected = form.priority === priority;
            return (
              <Pressable
                key={priority}
                onPress={() => setField('priority', priority)}
                style={[
                  styles.priorityButton,
                  {
                    backgroundColor: selected ? '#3c87f7' : theme.backgroundElement,
                    borderColor: selected ? '#3c87f7' : theme.backgroundSelected,
                  },
                ]}>
                <Text
                  style={[
                    styles.priorityText,
                    { color: selected ? '#fff' : theme.text },
                  ]}>
                  {priority}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: '#3c87f7', opacity: pressed || submitting ? 0.7 : 1 },
          ]}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Registrar Ticket</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: Spacing.two,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  descriptionInput: {
    minHeight: 110,
  },
});