import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'
import itsamatch from '../assets/match/itsamatch.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'

import logo from '../assets/logo.png'
import api from './services/api'

export default function Main({ navigation }) {
    const id = navigation.getParam('user')

    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)
    useEffect(() => {
        const socket = io('http://192.168.1.107:3333',{
            query:{ user: id}
        })
        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [id])

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            })

            setUsers(response.data)
        }
        loadUsers()
    }, [id])

    async function handleLike() {
        
         const [user, ...rest ]=users;
        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id }

        })
        setUsers(rest)
    }
    async function handledDisLike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id }
        })
        setUsers(rest)
    }


    async function handleLogout() {
        AsyncStorage.clear()
        navigation.navigate('Login')
    }

    return (
        <SafeAreaView style={Estilo.container}  >
            <TouchableOpacity onPress={handleLogout}>
                <Image style={{ marginTop: 10 }} source={logo} />
            </TouchableOpacity>
            <View style={Estilo.cardContainer} >
                {users.length === 0 ? <Text style={{ alignSelf: 'center', color: '#999', fontSize: 24, fontWeight: 'bold' }}> Acabou :( </Text>
                    : (users.map((user, index) => (
                        <View key={user._id} style={[Estilo.card, { zIndex: users.length - index }]}>
                            <Image style={Estilo.avatar} source={{ uri: user.avatar }} />
                            <View style={Estilo.footer} >
                                <Text style={Estilo.name} >{user.name}</Text>
                                <Text style={Estilo.bio} numberOfLines={3} >{user.bio}</Text>
                            </View>
                        </View>
                    ))
                    )}
            </View>
            {
                users.length > 0 && (
                    <View style={Estilo.buttonContainer} >
                <TouchableOpacity style={Estilo.button} onPress={handledDisLike} >
                    <Image source={dislike} />
                </TouchableOpacity>
                <TouchableOpacity style={Estilo.button} onPress={handleLike} >
                    <Image source={like} />
                </TouchableOpacity>
            </View>
                )
                

            }

            {
                matchDev &&(
                    <View style={Estilo.matchContainer} >
                        <Image style={Estilo.matchImage} source={itsamatch} />
                        <Image style={Estilo.matchAvata} source={{uri: matchDev.avatar}} />
                        <Text style={Estilo.matchName} >{matchDev.name}</Text>
                        <Text style={Estilo.matchBio} >{matchDev.bio}</Text>
                        <TouchableOpacity onPress={() => setMatchDev(null)}>
                            <Text style={Estilo.closeMatch} >Fechar!</Text>
                        </TouchableOpacity>

                    </View>
                )
            }
            
        </SafeAreaView>
    )
}



const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    cardContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        height: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    avatar: {
        flex: 1,
        height: 300
    },
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 15
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 12,
        lineHeight: 20

    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2
    },
    matchContainer:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor:'rgba(0,0,0,0.8)',
        alignItems:'center',
        justifyContent:'center'
    },
    matchImage:{
        height:60,
        resizeMode:'contain'
    },
    matchAvata:{
        width:160,
        height:160,
        borderRadius:80,
        borderColor:'#fff',
        marginVertical:30,
    },
    matchName:{
        fontSize:26,
        fontWeight:'bold',
        color:'#fff'
    },
    matchBio:{
        marginTop:10,
        fontSize:16,
        color:'rgba(255,255,255,0.8)',
        lineHeight:24,
        textAlign:'center',
        paddingHorizontal:30
    },
    closeMatch:{
        fontSize:16,
        color:'rgba(255,255,255,0.8)',
        textAlign:'center',
        marginTop:30,
        fontWeight:'bold'
    }
})