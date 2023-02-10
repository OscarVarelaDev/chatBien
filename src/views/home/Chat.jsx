import { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import MostrarMensajes from "../../component/MostrarMensajes";


function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const valueId = props.valueId;

  useEffect(() => {
    
    const url = `http://chat-backend.escotel.mx:5000/api/mensajes/${valueId}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setIsLoading(false)
      });

    return() => {
    }
  }, [])

  
  return (
    <>
      {isLoading ? <Loading/> : <MostrarMensajes messages={messages} />}
    </>
  );
}

export default Chat;
