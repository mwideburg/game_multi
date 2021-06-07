import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
import { SocketProvider } from './socketContext'
import { MainProvider } from './mainContext'
import './App.css'
import { ChakraProvider, Flex } from "@chakra-ui/react"
import { UsersProvider } from './usersContext'
import DefaultPage from './components/DefaultPage'
import Game from './components/Game/game'
function App() {
  return (
    <ChakraProvider>
      <MainProvider>
        <UsersProvider>
          <SocketProvider>
            <Flex className="App" align='center' flexDirection="column" justifyContent='center'>
              <Router>
                <Switch>
                  <Route exact path='/' component={Login} />
                  
                  <Route exact path='/game' component={Game} />
                  <Route exact path='/chat/:room' component={Chat} />
                  <Route component={DefaultPage} />
                </Switch>
              </Router>
              
            </Flex>
          </SocketProvider>
        </UsersProvider>
      </MainProvider>
    </ChakraProvider>
  );
}

export default App;
