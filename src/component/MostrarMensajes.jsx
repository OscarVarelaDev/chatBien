import { Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import Message from "./Message";
import { io } from "socket.io-client";
import Loading from "./Loading";
import { DownCircleOutlined, CloseOutlined } from '@ant-design/icons'

const URL = "http://chat-backend.escotel.mx:5000";
const socket = io(URL);

export default function MostrarMensajes({ 
  asistenciaId,
  dataAllMessage,
  setMostrarMensajes,
  mostrarMensajes,
  handleClick,
  }) {
  const [allMessages, setAllMessages] = useState([]);
  const [allNewMessages, setAllNewMessages] = useState({});
  const [goLastMessage, setGoLastMessage] = useState(false);

  useEffect(() => {
  
    const  filtroAsistenciaId =  dataAllMessage.filter((item) => item.AsistenciaId === asistenciaId);
    const [AsistenciaId] = filtroAsistenciaId
    const { Mensajes } = AsistenciaId;
    setAllNewMessages(Mensajes)
    
    const  nuevosMensajes = Mensajes.map((m) => {
      return {
        "EmisorId": m.EmisorId,
        "EmisorNombre": m.EmisorNombre,
        "Fecha": m.Fecha,
        "Mensaje": m.Mensaje,
        "Leido": m.leido,
        
      }
    })
    setAllMessages(nuevosMensajes)
    
    

  }, []);

  const goToLastMessage = () => {
    const div = document.getElementById('mensajeRenderizados');
     const newArraY= Array.from(div.children)
      const lastElement = newArraY[newArraY.length-1]
      lastElement.scrollIntoView();
  }

  const handleFinish = ({ userMessage }) => {
      const { EmisorNombre } = allNewMessages[0];
    const newMessage = {

      "EmisorId": asistenciaId,
      "EmisorNombre": EmisorNombre,
      "Fecha": new Date().toISOString(),
      "Mensaje": userMessage,
      "Leido": true,
      "TodosLosMensajes": allNewMessages
    }
 

   // sendData(newMessage, asistenciaId);
    socket.emit("message", { userMessage: newMessage, dataAllMessage });

    const addNewMessage=allMessages.map((m)=>{
      return {
        "EmisorId": m.EmisorId,
        "EmisorNombre": m.EmisorNombre,
        "Fecha": m.Fecha,
        "Mensaje": m.Mensaje,
        "Leido": true
      }
    })
    addNewMessage.push(newMessage)
    setGoLastMessage(true)
    setAllMessages(addNewMessage)
    goToLastMessage()
    document.getElementById("send_message").reset();
  }



  const sendData = (newMessage) => {
    fetch(`http://chat-backend.escotel.mx:5000/api/newMensaje/${asistenciaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage)
    })
      .then((response) => response.json())
      .then((data) => { console.log(data) })

  };
  const closeChat = () => {
    setMostrarMensajes(!mostrarMensajes)
    handleClick()
    
  }

  return (
    <>
      <div className="container m-1 w-100" >
        <div className="card" style={{backgroundColor:"#ffffff"}} >
          <div className="card-body">
            <div >
              <div
                style={
                  {
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "100%",
                    position: "relative",
                    cursor: "pointer",
                    color: "#362FD9",
                    fontSize: "20px",
                  }
                } 
              >
                <CloseOutlined
                  onClick={closeChat}
                />
              </div>
            </div>
            <h5 className="text-center" style={{
              fontSize: "20px",
              color: "#1581af",
              textAlign: "center",
              fontWeight: "bold",
             

            }}>Chat</h5>

          </div>
          <div
            style={{
              borderRadius: "5px",
              padding: "0px",
              backgroundColor: "#ffff",
              height: "600px",
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
              <div id="mensajeRenderizados" style={{
                display: "flex",
                flexDirection: "column",
                //separar lo mensajes
                gap: "20px",
                paddingBottom: "145px",
                
                
              }}>
                {
                  allMessages.map((m, i) => (
                    <Message
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
                onClick={() => { goToLastMessage() }} />
              <p>Ir al último mensaje</p>
            </div>
            <Form name="send_message" style={{ paddingTop: "0px" }} onFinish={handleFinish}  >
            
              <div className="d-flex">
                <Form.Item
                  style={{ width: "100%" }}
                  name="userMessage"
                  rules={[{ required: true, message: "El campo es requerido" }]}
                >
                  <Input.TextArea autoSize placeholder="Ingresa tu mensaje"  id="btn-chat-enviarDatos" 
                  />
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
