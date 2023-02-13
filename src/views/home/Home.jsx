import Chat from "./Chat";
import { Row, Col, Button } from "antd";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  MenuFoldOutlined,
  MailOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';




const Home = () => {
  const [dataAllMessage, setDataAllMessage] = useState([]);
  const [asistenciaId, setAsistenciaId] = useState("");
  const [mostrarMensajes, setMostrarMensajes] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const socket = io("http://chat-backend.escotel.mx:5000");

  const toggleCollapsed = () => {

    setCollapsed(!collapsed);
  };

  useEffect(() => {

    const url = `http://chat-backend.escotel.mx:5000/api/chatsCabina`;
    const consultarApi = async () => {
      const response = await fetch(url);
      const result = await response.json();
      console.log("ResultApi",result)
      setDataAllMessage(result)
      console.log(dataAllMessage)
    };
    consultarApi();

  }, []);



  useEffect(() => {
    socket.on("message", newMessage => {
      const { body: { userMessage } } = newMessage
      const { body: { dataAllMessage } } = newMessage
      /*    
            const newData = dataAllMessage.map((x, i) => {
      
              if (x.AsistenciaId === userMessage.EmisorId) {
                x.MensajesNoLeidos = true
                x.Mensajes.push(userMessage)
              }
              return x
            })
            setDataAllMessage(newData) */

    })
    return () => socket.off("message")
  }, [socket.on])

  const handleClick = (key) => {
    setMostrarMensajes(!mostrarMensajes);
    const { AsistenciaId } = dataAllMessage[0];
    setAsistenciaId(AsistenciaId);
    console.log("click")

  }
  /* 
    useEffect(() => {
  
  
      const dataSource = dataAllMessage.map((x, i) => ({
        key: x.AsistenciaId,
        AsistenciaId: x.AsistenciaId,
        Mensajes: x.Mensajes[x.Mensajes.length - 1].Mensaje,
        MensajesNoLeidos: x.MensajesNoLeidos,
        Acciones: (
          <Button type="primary" id="botones" onClick={handleClick}>
            Ver Mensajes
          </Button>
  
        ),
      }
      ));
  
      setDataTable(dataSource)
    }, [dataAllMessage])
   */


  return (
    <Row   >
      <Col
        xs={mostrarMensajes ? 12 : 24}
        sm={mostrarMensajes ? 12 : 24}
        md={mostrarMensajes ? 16 : 24}
        lg={mostrarMensajes ? 3 : 24}
        xl={mostrarMensajes ? 3 : 24}
      >
        <div style={{
          padding: 24, minHeight: 280, background: '#fff',
          
        }}>
          <Button type="primary" onClick={handleClick} style={{ marginBottom: 16 }}>
            Abrir mi chat</Button>
        </div>
      </Col>
      <Col
        xs={mostrarMensajes ? 8 : 0}
        sm={mostrarMensajes ? 8 : 0}
        md={mostrarMensajes ? 10 : 0}
        lg={mostrarMensajes ? 21 : 0}
        xl={mostrarMensajes ? 21 : 0}
      >
        {mostrarMensajes?<Chat
          dataAllMessage={dataAllMessage}
          asistenciaId={asistenciaId}
          setMostrarMensajes={setMostrarMensajes}
          mostrarMensajes={mostrarMensajes}
          handleClick={handleClick}
        />:null}
      </Col>
    </Row>

  );

};
export default Home;
