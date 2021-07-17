import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import {
    Flex,
    Text,
    Button,
} from "@chakra-ui/react"
import MultiWorldScene from './MultiworldScene'
import Chat from '../Chat/Chat'
import { useToast } from "@chakra-ui/react"

const MultiContainer = () => {
    const { name, room, game, id, setName, setRoom, setGame, setID } = useContext(MainContext);
    const { users, setUsers } = useContext(UsersContext);
    const socket = useContext(SocketContext);
    useEffect(() => {



    })



    return (
        <div >
            <MultiWorldScene />
        </div>
    )
}

export default MultiContainer