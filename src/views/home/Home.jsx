import Chat from "./Chat";
import { Row, Col, Table, Button, Alert } from "antd";
import { useEffect, useState } from "react";
import Notification from "../../component/Notification";
import { io } from "socket.io-client";
import { Badge } from "antd";
import { AlertOutlined } from "@ant-design/icons";


const Home = () => {
  const [dataAllMessage, setDataAllMessage] = useState([]);
  const [asistenciaId, setAsistenciaId] = useState("");
  const [mostrarMensajes, setMostrarMensajes] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [notification, setNotification] = useState(false);

  
  const socket = io("http://chat-backend.escotel.mx:5000");

  const columns = [
    {
      title: "Asistencia Id",
      dataIndex: "AsistenciaId",
      key: "AsistenciaId",
    },
    {
      title: "Mensajes",
      dataIndex: "Mensajes",
    },
    {
      title: "Mensajes No leidos ",
      dataIndex: "MensajesNoLeidos",
      key: "MensajesNoLeidos",

    },
    {
      title: "",
      dataIndex: "Acciones",
      render: (_, mensaje) => <Button type="primary" id="botones" onClick={() => handleClick(mensaje.key)}>Ver mensajes</Button>
    },

  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const url = `http://chat-backend.escotel.mx:5000/api/chatsCabina`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setDataAllMessage(data);
    
    }

    catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {

    socket.on("newAsistencia", newAsistencia => {
          console.log(newAsistencia) 
    })
    socket.on("message", newMessage => {
      const { body: { userMessage } } = newMessage
      const { body: { dataAllMessage } } = newMessage

      const newData = dataAllMessage.map((x, i) => {
      
        if (x.AsistenciaId === userMessage.EmisorId) {
          x.MensajesNoLeidos = true
          x.Mensajes.push(userMessage)
        }
        return x
      })
      setDataAllMessage(newData)
   
    })
    return () => socket.off("message")
  }, [socket.on])

  const handleClick = (key) => {
    const botones = document.querySelectorAll("#botones");
    if (mostrarMensajes) {
      botones.forEach((boton) => {
        boton.hidden=false;
        boton.innerHTML = "Ver Mensajes";
        

      });
    } else { 

      botones.forEach((boton) => {
        boton.hidden=true;
        boton.innerHTML = "Ocultar Mensajes";

      });
    }
    setMostrarMensajes(!mostrarMensajes);
    setAsistenciaId(key);
    
  }

  useEffect(() => {

   
    const dataSource = dataAllMessage.map((x, i) => ({
      key: x.AsistenciaId,
      AsistenciaId: x.AsistenciaId,
      Mensajes: x.Mensajes[x.Mensajes.length - 1].Mensaje,
      MensajesNoLeidos:x.MensajesNoLeidos ,
      Acciones: (
        <Button type="primary" id="botones" onClick={handleClick}>
          Ver Mensajes
        </Button>

      ),
    }
    ));
  
    setDataTable(dataSource)
  }, [dataAllMessage])

  

  return (
    <Row   >
      <Col
        xs={mostrarMensajes ? 12 : 24}
        sm={mostrarMensajes ? 12 : 24}
        md={mostrarMensajes ? 16 : 24}
        lg={mostrarMensajes ? 10 : 24}
        xl={mostrarMensajes ? 10: 24}

      >
        <Table
          // pagination={{ pageSize: 3 }}
        className="rowChats" columns={columns} rowKey={x => x.AsistenciaId} dataSource={dataTable
          .map((x) => {
            return {
              ...x,
         
              /*  TODO:
              * 1. Validar si hay mensajes en el array de mensajes  y mostrar no hay mensajes nuevos 
              * 2.Crear un objeto de un nuevo menaje y enviarlo al backend con un socket 
              */
              AsistenciaId: x.AsistenciaId?x.AsistenciaId:<Alert message="Crear un nuevo mensaje" type="error" />,
              MensajesNoLeidos: x.MensajesNoLeidos ? <Notification text={"Tienes mensajes nuevos"}/>
            :<Notification text={"No tienes mensajes nuevos"}/>,
            //mostrar el boton con la leyenda crear mensaje si no hay mensajes en el array de mensajes
          /*     Acciones: x.Mensajes.length > 0 ? x.Acciones : <Button type="primary" id="botones" onClick={() => handleClick(x.key)}>Crear Mensaje</Button>
               */
            }
          
          })
        } />
      </Col>
      <Col
        xs={mostrarMensajes ? 8 : 0}
        sm={mostrarMensajes ? 8 : 0}
        md={mostrarMensajes ? 10 : 0}
        lg={mostrarMensajes ? 14 : 0}
        xl={mostrarMensajes ? 14 : 0}
      >

        {mostrarMensajes ? <Chat
          dataAllMessage={dataAllMessage}
          asistenciaId={asistenciaId}
          setMostrarMensajes={setMostrarMensajes}
          mostrarMensajes={mostrarMensajes}
          handleClick={handleClick}

        /> : null}
      </Col>
    </Row>

  );

};
export default Home;
