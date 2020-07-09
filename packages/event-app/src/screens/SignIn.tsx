import gql from 'graphql-tag';
import React, {useState, useContext, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {View, TextInput, StyleSheet, Text, Alert} from 'react-native';
import {useTheme, Theme, ActivityIndicator} from 'react-native-paper';

import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText, BoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {MenuNavigationProp} from '../typings/navigation';
import {getValueFromStore, setValueInStore} from '../utils';
import client from '../utils/gqlClient';

const SIGNIN = gql`
  mutation sign($email: String!, $password: String!) {
    signin(email: $email, password: $password)
  }
`;

export default function SignInScreen({
  navigation,
}: {
  navigation: MenuNavigationProp<'SignIn'>;
}) {
  const {colors}: Theme = useTheme();
  const {event} = useContext(DataContext);
  const {control, handleSubmit, errors} = useForm();
  const [loading, setLoading] = useState(false);

  async function getAdminToken() {
    if (!event?.slug) return;
    const token = await getValueFromStore('adminToken', event.slug);
    if (token) {
      navigation.navigate('Menu');
    }
  }

  useEffect(() => {
    getAdminToken();
  }, []);

  async function onSubmit(data: {email: string; password: string}) {
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: SIGNIN,
        variables: {email: data.email, password: data.password},
      });
      await setValueInStore('adminToken', result.data.signin);
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Sign in failed', 'The email or password provided is wrong.');
    }
    setLoading(false);
  }

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
          name="email"
          rules={{required: true}}
          defaultValue=""
        />
        {errors.email && <Text>This is required.</Text>}
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
          name="password"
          rules={{required: true}}
          defaultValue=""
        />
        {errors.password && <Text>This is required.</Text>}
      </View>
      {loading ? (
        <ActivityIndicator animating style={styles.loader} />
      ) : (
        <PrimaryButton onPress={handleSubmit(onSubmit)}>
          <SemiBoldText fontSize="md" TextColorAccent>
            Sign in
          </SemiBoldText>
        </PrimaryButton>
      )}
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
  loader: {
    marginTop: 25,
  },
});
