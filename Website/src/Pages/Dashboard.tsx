import {useCookies} from 'react-cookie'
import { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import ChatContainer from '../components/ChatContainer'
import Matchmaker from '../components/Matchmaker'
import ChatList from '../components/ChatList'
import '../Styling/Dashboard.css'

const Dashboard = () => {
  const [chatListDataLoading, setChatListDataLoading] = useState(true)
  const [cookies, setCookie, removeCookie] = useCookies(['AuthToken'])
  const [showChatContainer, setShowChatContainer] = useState(false)
  const [selectedMatchId, setSelectedMatchId] = useState("") // Add a state variable for selected match ID
  const [selectedUsername, setSelectedUsername] = useState("") // Add a state variable for selected username

  const authToken = cookies.AuthToken

  return (
    <>
    <Nav 
      authToken={authToken}
        minimal={true}
        setShowModal={() => {}} // Just an empty func
        showModal={false}
    />
    <div className="dashboard">
      <section className="chat-list-section">
        <ChatList
          chatListDataLoading={chatListDataLoading}
          setChatListDataLoading={setChatListDataLoading}
          setShowChatContainer={setShowChatContainer}
          setSelectedMatchId={setSelectedMatchId} // Pass setSelectedMatchId as prop
          setSelectedUsername={setSelectedUsername}
        />
      </section>
      <section className="matchmaker-section">
        {showChatContainer && (
          <ChatContainer
            setShowChatContainer={setShowChatContainer}
            selectedMatchId={selectedMatchId}
            selectedUsername={selectedUsername}
          />
        )}
        {!showChatContainer && <Matchmaker />}
      </section>
    </div>
    </>
  )
}

export default Dashboard
