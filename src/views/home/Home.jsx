import Chat from "./Chat";
import { Row, Col, Table, Button } from "antd";
import { useEffect, useState } from "react";
import Notification from "../../component/Notification";
import Loading from "../../component/Loading";
import { io } from "socket.io-client";


const Home = () => {
  const [dataAllMessage, setDataAllMessage] = useState([]);
  const [asistenciaId, setAsistenciaId] = useState("");
  const [mostrarMensajes, setMostrarMensajes] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const socket = io("http://chat-backend.escotel.mx:5000");


  const columns = [
    {
      title: "Asistencia Id",
      dataIndex: "AsistenciaId",
      key: "AsistenciaId",
    },
    {
      title: "Ultimo mensaje",
      dataIndex: "Mensajes",
      key: "Mensajes",
    },
    {
      title: "Mensajes No leidos ",
      dataIndex: "MensajesNoLeidos",

    },
    {
      title: "Acciones",
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
      //puede a ver un problema con el asistenciaId
    }

    catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    socket.on("message", newMessage => {
      console.log("Asegurarme Llegue bie",newMessage)
      const { body: { userMessage } } = newMessage
      const {body:{dataAllMessage}} = newMessage
      console.log("UserMessage",userMessage)
      console.log("dataAllMessage",dataAllMessage)
      //duplicar el array y agregar  el mensaje por asistencia
        console.log(userMessage.EmisorId)
      const newData =dataAllMessage.map((x)=>{
          if(x.AsistenciaId === userMessage.EmisorId){
            x.Mensajes.push(userMessage)
          }
          return x
       
      })
      console.log("newData",newData)
      setDataAllMessage(newData)
    })
    return () => socket.off("message")
  }, [socket.on])


  useEffect(() => {
    const dataSource = dataAllMessage.map((x, i) => ({
      AsistenciaId: x.AsistenciaId,
      Mensajes: x.Mensajes[x.Mensajes.length - 1].Mensaje,
      MensajesNoLeidos: !x.MensajesNoLeidos ? <Notification text={"Tienes mensajes nuevos sin leer"} /> : <Notification text={"No tienes mensajes nuevos "} />,
      key: x.AsistenciaId,
      Acciones: (
        <Button type="primary" id="botones" onClick={handleClick}>
          Ver Mensajes
        </Button>

      ),
    }
    ));
    setDataTable(dataSource)
  }, [dataAllMessage])

  const handleClick = (key) => {
    const botones = document.querySelectorAll("#botones");
    if (mostrarMensajes) {
      botones.forEach((boton) => {
        boton.innerHTML = "Ver Mensajes";
      });
    } else {
      botones.forEach((boton) => {
        boton.innerHTML = "Cerrar Mensajes";
      });
    }
    setMostrarMensajes(!mostrarMensajes);
    setAsistenciaId(key);
      
  }

  return (
    <Row   >
      <Col
        xs={mostrarMensajes ? 12 : 24}
        sm={mostrarMensajes ? 12 : 24}
        md={mostrarMensajes ? 16 : 24}
        lg={mostrarMensajes ? 12 : 24}
        xl={mostrarMensajes ? 12 : 24}

      >
        <Table className="rowChats" columns={columns} rowKey={x => x.AsistenciaId} dataSource={dataTable} />


      </Col>
      <Col
        xs={mostrarMensajes ? 8 : 0}
        sm={mostrarMensajes ? 8 : 0}
        md={mostrarMensajes ? 8 : 0}
        lg={mostrarMensajes ? 12 : 0}
        xl={mostrarMensajes ? 12 : 0}
      >

        {mostrarMensajes ? <Chat dataAllMessage={dataAllMessage} asistenciaId={asistenciaId} /> : null}
      </Col>
    </Row>

  );

};
export default Home;
