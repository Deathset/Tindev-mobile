import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, View, Image, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import logo from '../assets/logo.png'
import api from './services/api'
import AsyncStorage from '@react-native-community/async-storage'

export default function Login({ navigation }) {

    const [user, setUser] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('user').then( user => {
                if (user) {navigation.navigate('Main', { user })}
            })
    }, [])

    async function handleLogin() {
        const response = await api.post('/devs', { username: user })
        const { _id } = response.data

        await AsyncStorage.setItem('user', _id)
        navigation.navigate('Main', { user:_id })
    }

    return (
        <KeyboardAvoidingView
            behavior='padding'
            enabled={Platform.OS == 'ios' ? true : true}
            style={Estilos.container} >
            <Image source={logo} />

            <TextInput
                placeholder="Digite seu usuário no GitHub"
                style={Estilos.input}
                placeholderTextColor='#999'
                autoCapitalize='none'
                autoCorrect={false}
                value={user}
                onChangeText={setUser}
            />

            <TouchableOpacity style={Estilos.button} onPress={handleLogin} >
                <Text style={Estilos.buttontxt}>Enviar</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

const Estilos = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 15,
        paddingHorizontal: 15
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttontxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})