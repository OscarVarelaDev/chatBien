import { Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import Message from "./Message";
import { io } from "socket.io-client";
import Loading from "./Loading";
import { DownCircleOutlined,CloseOutlined } from '@ant-design/icons'


const URL = "http://chat-backend.escotel.mx:5000";
const socket = io(URL);

export default function MostrarMensajes({ messages }) {
  //Tengo todos mis datos actualizados en allMessages

  const [allMessages, setAllMessages] = useState([]);
  const { AsistenciaId } = messages[0];
  const { Mensajes } = messages[0];
  const EmisorNombre = Mensajes[0].EmisorNombre;


  useEffect(() => {
    setAllMessages([...Mensajes]);
  }, []);

  const goToLastMessage = () => {
    const div = document.getElementById('mensajeRenderizados');
    let lastElement = div.lastElementChild;
    lastElement.scrollIntoView();
  }


  const handdleLastMessage = (e) => {
    goToLastMessage()
    
  }

  const handleFinish = ({ userMessage }) => {

    const newMessage = {
      "EmisorId": AsistenciaId,
      "EmisorNombre": EmisorNombre,
      "Fecha": new Date().toISOString(),
      "Mensaje": userMessage,
      "Leido": false
    }
    sendData(newMessage, AsistenciaId);
    socket.emit("message", { userMessage: newMessage, });
    setAllMessages([...allMessages, newMessage]);
    //limpiar el imput
    document.getElementById("send_message").reset();
  


  }

  const sendData = (newMessage, AsistenciaId) => {
    const response = fetch(`http://chat-backend.escotel.mx:5000/api/newMensaje/${AsistenciaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage)
    })
      .then((response) => response.json())
      .then((data) => { console.log(data) })

  };


  useEffect(() => {
    const handleIncomingMessages = ({ userMessage }) => {
      setAllMessages([...messages, userMessage]);
    }
    socket.on("message", handleIncomingMessages);
    return () => {
      socket.off("message", handleIncomingMessages);
    }
  }, [allMessages]);



  if (!messages.length || !Mensajes.length) {
    return <Loading />
  }

  return (
    <>
      <div className="container m-1 w-100">
        <div className="card">
          <div className="card-body">
          <div
              style={
                {//colocar en la parte derecha del chat
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                  position: "relative",
                  cursor: "pointer",
                  color: "red",
                  fontSize: "20px",
                }
              }
            ><CloseOutlined />
            
            </div>
            <h5 className="text-center" style={{
              fontSize: "20px",
              color: "black",
              textAlign: "center",
              marginTop: "5px",
            }}>Chat</h5>
           
            {/* Chat */}

          </div>
          <div 
            style={{
              borderRadius: "5px",
              padding: "20px",
              backgroundColor: "#f5f5f5",
              height: "400px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "block",
                padding: "3",
                justifyContent: "start",

              }}
            >
              <div id="mensajeRenderizados">

              {allMessages.map((m, i) => (
                <Message 
                  //crear un id unico para cada mensaje

                  key={i}
                  EmisorNombre={m.EmisorNombre}
                  Mensaje={m.Mensaje}
                  Fecha=
                  {
                    new Date(m.Fecha).toLocaleDateString('es-mx', {
                      weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"
                    })
                  }
                 

                />
              ))

              }
            </div>
            </div>

          </div>
          <div className="card-footer">
            <div style={{ textAlign: "center" }}>
              <DownCircleOutlined 
              style={{
                display: "block",
                position: "end",
                fontSize: "40px",
                padding: "15px",
                color: "rgb(69, 69, 69)",
                cursor: "pointer",
              }}
                onClick={handdleLastMessage} />
              <p>Ir al último mensaje</p>
            </div>
            <Form name="send_message" style={{ paddingTop: "10px" }} onFinish={handleFinish}>
              <div className="d-flex">
                <Form.Item
                  style={{ width: "100%" }}
                  name="userMessage"
                  rules={[{ required: true, message: "El campo es requerido" }]}
                >
                  <Input.TextArea autoSize placeholder="Ingresa tu mensaje" id="btn-chat-enviarDatos" />
                </Form.Item>

                <Button
                  className="mx-3"
                  type="primary"
                  placeholder="Ingresa tu mensaje"
                  htmlType="submit"
                  id="btn-chat-enviarDatos"
                >
                  Enviar Mensaje
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
