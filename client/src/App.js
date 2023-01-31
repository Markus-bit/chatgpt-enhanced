import chatgpticon from './chatgptlogo.png'
import './App.css';
import './normal.css'
import {useState, useEffect} from 'react';


function App() {


  useEffect(() => {
    getModels();
  }, [])

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("ada");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "How can i help you?"
  },{
    user: "me",
    message: "I want to use ChatGPT"
  }]);

  function clearChat(){
    setChatLog([]);
  }


  function getModels(){
    fetch("http://localhost:3080/models")
      .then(res => res.json())
      .then(data => setModels(data.models.data))
  }

  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}
    `} ] 
    setInput("");
    setChatLog(chatLogNew)

    const messages = chatLogNew.map((message) => message.message).join("\n")

    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          message: messages,
          currentModel,
        })
    });

    const data = await response.json();
    await setChatLog([...chatLog, { user: "gpt", message: `${data.message}
    `} ])
  }

  return (
    <div className="App">
    <aside className="sidemenu">
      <div className="side-menu-button" onClick={clearChat}>
        <span>+</span>
        New chat
      </div>
      <div className="models">
        <select onChange={(e) =>{
          setCurrentModel(e.targetvalue)
        }}>
          {models?.map((model, index) => (
            <option key={model.id} value={model.id}>{model.id}</option>
          ))}
        </select>
      </div>
    </aside>
    <section className="chatbox">

      <div className="chat-log">
        {chatLog.map((message, index) => (
          <ChatMessage key = {index} message = {message}/>
        ))}
        
      </div>

      <div className="chat-input-holder">
        <form onSubmit={handleSubmit}>
        <input
         rows="1" 
         value = {input}
         onChange = {(e)=> setInput(e.target.value)}
         className="chat-input-textarea"></input>
        </form>
      </div>

    </section>
      
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>

      <div className="chat-message-center">

        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {message.user === "gpt" && <img className="chatgptlogo" alt="chatgpticon" src={chatgpticon}/>}
        </div>
        <div className="message">
          {message.message}
        </div>
      </div>
    </div>
  )
  
  
}


export default App;
