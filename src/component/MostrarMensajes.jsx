import { Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import Message from "./Message";


import { io } from "socket.io-client";
import Loading from "./Loading";

const URL = "http://localhost:4000";
const socket = io(URL);

export default function MostrarMensajes({ messages }) {

  const [allMessages, setAllMessages] = useState([]);
  const { AsistenciaId } = messages[0];
  const { Mensajes } = messages[0];

  const EmisorNombre = Mensajes[0].EmisorNombre;

  useEffect(() => {
    setAllMessages([...Mensajes]);
  }, []);


  const sendData = async ({newMessage}) => {

    const res = await fetch(`http://localhost:4000/api/newmessage/${AsistenciaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
    const data = await res.json()


  };

  const handleFinish = ( {userMessage} ) => {
    const date = new Date();
   
    const newMessage = {
      "AsistenciaId": AsistenciaId,
      "EmisorID":"EmisorId",
      "EmisorNombre": EmisorNombre,
      "Mensaje": userMessage,
      "Fecha": date,
      "MensajesNoLeido": false

    }
     socket.emit("message", {
      userMessage: newMessage,

    }); 
    sendData(newMessage); 
    setAllMessages([...allMessages, newMessage]);
    document.getElementById("send_message").reset();
  }

  useEffect(() => {

    const handleIncomingMessages = ({userMessage}) => {
      setAllMessages([...messages, userMessage]);
    }
    socket.on("message", handleIncomingMessages);
    return () => {
      socket.off("message", handleIncomingMessages);
    }
  }, [allMessages]);

  if (!messages.length || !Mensajes.length) {
    return <Loading/>
  }


  return (
    <>
      <div className="container m-1 w-100">
        <div className="card">
          <div className="card-body">
            <h5 className="text-center">Chat</h5>

            {/* Chat */}

            <Form name="send_message" onFinish={handleFinish}>
              <div className="d-flex">
                <Form.Item
                  style={{ width: "100%" }}
                  name="userMessage"
                  rules={[{ required: true, message: "El campo es requerido" }]}
                >
                  <Input.TextArea autoSize placeholder="Mensaje" />
                </Form.Item>

                <Button
                  className="mx-3"
                  type="primary"
                  placeholder="Ingresa tu mensaje"
                  htmlType="submit"
                >
                  Enviar Mensaje
                </Button>
              </div>
            </Form>
          </div>
          <div
            style={{
              borderRadius: "5px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "block",
                padding: "3",
                justifyContent: "start",
              }}
            >
            
              {allMessages.map((m, i) => (
                <Message
                  key={i}
                  EmisorNombre={m.EmisorNombre}
                  Mensaje={m.Mensaje}
                />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
