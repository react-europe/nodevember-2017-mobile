import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {View, TextInput, StyleSheet} from 'react-native';
import {useTheme, Theme} from 'react-native-paper';

import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText, BoldText} from '../components/StyledText';

export default function SignInScreen() {
  const {colors}: Theme = useTheme();
  const {control, handleSubmit, errors} = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={styles.form}>
        <BoldText fontSize="sm">Email</BoldText>
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <TextInput
              style={[styles.input, {borderColor: colors.primary}]}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              autoCompleteType="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          )}
          name="firstName"
          rules={{required: true}}
          defaultValue=""
        />
        <BoldText fontSize="sm">Password</BoldText>
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <TextInput
              style={[styles.input, {borderColor: colors.primary}]}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry
            />
          )}
          name="lastName"
          defaultValue=""
        />
      </View>
      <PrimaryButton onPress={handleSubmit(onSubmit)}>
        <SemiBoldText fontSize="md" TextColorAccent>
          Sign in
        </SemiBoldText>
      </PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    padding: 4,
    margin: 4,
    fontFamily: 'open-sans-semibold',
  },
  form: {
    marginHorizontal: 20,
  },
});
