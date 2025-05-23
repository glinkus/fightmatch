// React modules
import {useCookies} from 'react-cookie'
import { useState, useEffect } from 'react'
// Application components
import { GetRequest } from '../Functions/GetRequest'
import { PostRequest } from '../Functions/PostRequest'
// Styling
import '../Styling/ChatList.css'

const ChatList = ({chatListDataLoading, setChatListDataLoading, setShowChatContainer, setSelectedMatchId, setSelectedUsername} : {chatListDataLoading:any, setChatListDataLoading:any, setShowChatContainer:any, setSelectedMatchId:any, setSelectedUsername:any}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['AuthToken'])
    
    const [chatArray, setChatArray] = useState<Array<any>>([])

    // Get request for possible matches
    useEffect(() => {
        GetRequest('matches/matched', [], cookies.AuthToken)
        .then((response) => {
          const chatArray = response as Array<any>
          setChatArray(chatArray)
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
            setChatListDataLoading(false)
        });
    }, [chatListDataLoading, cookies.AuthToken])

    const handleUpdateClick = () => {
        setChatListDataLoading(true)
    }

    const handleChatSelectClick = (matchId: any, username: any) => {
        setSelectedMatchId(matchId)
        setSelectedUsername(username)
        setShowChatContainer(true)
    }
    

    return (
        <div className='chat-list'>
            {chatArray.length === 0 ? (
                <h3>No fight foreseen</h3>
            ) : (
                chatArray.map(match => (
                    <button className='chat-list-button' key={match.id} onClick={() => handleChatSelectClick(match.matchId, match.username)}>
                        <div className='picture-container'>
                            <img src={match.primaryPicture}/>
                        </div>
                        <div className='username-container'>
                            {match.username}
                        </div>                        
                    </button>
                ))
            )}
            <button className='update-button' onClick={handleUpdateClick}>
                Update
            </button>
        </div>
    )
}
export default ChatList