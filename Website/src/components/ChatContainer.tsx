//import { useRef} from 'react';
import '../Styling/ChatContainer.css';
import { useCookies } from 'react-cookie';
import { useState, useEffect, useRef } from 'react';
// Application components
import { GetRequest } from '../Functions/GetRequest';
import { PostRequest } from '../Functions/PostRequest';
import sendImg from '../images/messageSend.png';

const ChatContainer = ({
  setShowChatContainer,
  selectedMatchId,
  selectedUsername,
}: {
  setShowChatContainer: any;
  selectedMatchId: any;
  selectedUsername: any;
}) => {
  const [chatArray, setChatArray] = useState<Array<any>>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['AuthToken']);
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleCloseClick = () => {
    setShowChatContainer(false);
  };

  const handleInputChange = (event: any) => {
    setInputText(event.target.value);
  };

  const handleSendClick = (e: any) => {
    e.preventDefault();
    setShowChatContainer(true);
    
    if (inputText !== '') {
      const requestBody = [
        { name: 'recipient', value: selectedUsername },
        { name: 'message', value: inputText },
      ];
      // Response stores the JSON body containing the authentication token
      PostRequest('chat/message', [], requestBody, cookies.AuthToken)
        .then(() => {
          setInputText('');
          // Refresh chatArray after sending the message
          return GetRequest('chat', [{ name: 'matchId', value: selectedMatchId }], cookies.AuthToken);
        })
        .then((response) => {
          const chatArray = response as Array<any>;
          setChatArray(chatArray);
          scrollToBottom();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    GetRequest('chat', [{ name: 'matchId', value: selectedMatchId }], cookies.AuthToken)
      .then((response) => {
        const chatArray = response as Array<any>;
        setChatArray(chatArray);
        scrollToBottom()
      })
      .catch((error) => {
        console.error(error);
      });
  }, [cookies.AuthToken, selectedMatchId]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // Sort chatArray by date
  const sortedChatArray = [...chatArray].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  return (
    <div className="chat-container">
      <div className='close-button-container'>
        <button className="close-button" onClick={handleCloseClick}>
          X
        </button>
      </div>
      <div className="message-container">
        {sortedChatArray.map((message, index) => (
          <div className={message.sender === selectedUsername ? 'message-received' : 'message-sent'} key={index}>
            <div className={message.sender === selectedUsername ? 'message-received-text' : 'message-sent-text'}>
              {message.message}
            </div>
          </div>
        ))}
        <div ref={chatContainerRef}></div>
      </div>
      <div className="input-box-group">
        <form onSubmit={handleSendClick}>
            <input
                className="input-box"
                type="text"
                id="sendMessage"
                name="sendMessage"
                placeholder="Your message here"
                value={inputText}
                onChange={handleInputChange}
            />
            <button className="send-button" type="submit">
                <img className="send-button-image" src={sendImg} alt="Send" />
            </button>
        </form>
       </div>
    </div>
);
};

export default ChatContainer;
