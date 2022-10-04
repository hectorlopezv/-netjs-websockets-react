import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import "./App.css";

function App() {
  const socket = io("http://localhost:3000");
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setmessages] = useState<any>([]);
  const [name, setname] = useState("");
  const [typingDisplay, setTypingDisplay] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    socket.emit("findAllMessages", {}, (res: any) => {
      setmessages(res);
    });

    socket.on("message", (message) => {
      setmessages((value: any) => [...value, message]);
    });
  }, []);

  useEffect(() => {
    socket.on("typing", (res: any) => {
      console.log("typing", res, isTyping);
      if (res.isTyping && isTyping) {
        setTypingDisplay(`${name} is typing....`);
      } else {
        setTypingDisplay("");
      }
    });
  }, [message]);
  const sendMessage = () => {
    socket.emit("createMessage", { text: message }, (res: any) => {
      setMessage("");
    });
  };
  const join = () => {
    socket.emit("join", { name: name }, () => {
      setJoined(true);
    });
  };

  const inputHandler = (value: string) => {
    console.log("inputhandler", value);
    setMessage(value);
  };

  useEffect(() => {
    socket.emit("typing", { isTyping: true });

    setIsTyping(true);
  }, [message]);
  return (
    <div className="App">
      {joined === false ? (
        <>
          <input
            type="text"
            placeholder="whats your name"
            onChange={(e) => setname(e.target.value)}
          />
          <button onClick={join}>Send your Name</button>
        </>
      ) : (
        <>
          {messages.map(({ name, text }: any, id: number) => {
            return (
              <div className="text-white" key={id}>
                <p>{name}</p>
                <p>{text}</p>
              </div>
            );
          })}
          {typingDisplay && <p className="text-white">{`....Typing${name}`}</p>}
          <input type="text" onChange={(e) => inputHandler(e.target.value)} />
          <button onClick={sendMessage}>Send Message</button>
        </>
      )}
    </div>
  );
}

export default App;
