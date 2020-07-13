import {useFocusEffect} from '@react-navigation/native';
import gql from 'graphql-tag';
import React, {useState, useContext, useCallback} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {
  useTheme,
  Theme,
  ActivityIndicator,
  TextInput,
} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText, BoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {MenuNavigationProp} from '../typings/navigation';
import {setValueInStore} from '../utils';
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
  const [adminToken, setAdminToken] = useRecoilState(adminTokenState);

  async function getAdminToken() {
    if (adminToken?.token && adminToken.edition === event?.slug) {
      navigation.navigate('Menu');
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAdminToken();
    }, [adminToken])
  );

  async function onSubmit(data: {email: string; password: string}) {
    if (!event?.slug) return;
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: SIGNIN,
        variables: {email: data.email, password: data.password},
      });
      const token: string = result.data.signin;
      await setValueInStore('adminToken', token);
      setAdminToken({token, edition: event.slug});
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Sign in failed', 'The email or password provided is wrong.');
    }
    setLoading(false);
  }

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={styles.form}>
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
              label="Email"
            />
          )}
          name="email"
          rules={{required: true}}
          defaultValue=""
        />
        {errors.email && <Text>This is required.</Text>}
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
              label="Password"
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
    margin: 4,
  },
  form: {
    marginHorizontal: 20,
  },
  loader: {
    marginTop: 25,
  },
});
