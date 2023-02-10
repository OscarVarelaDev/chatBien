import Chat from "./Chat";
import { Row, Col, Table, Button } from "antd";
import { useEffect, useState } from "react";
import Notification from "../../component/Notification";
import Loading from "../../component/Loading";
import { io } from "socket.io-client";


const Home = () => {
  const [data, setData] = useState([]);
  const [asistenciaId, setAsistenciaId] = useState("");
  const [mostrarMensajes, setMostrarMensajes] = useState(false);

  const [dataTable, setDataTable] = useState([]);
  const socket = io("http://chat-backend.escotel.mx:5000");


  const handleClick = (key) => {
    const botones = document.querySelectorAll("#botones");
    if (mostrarMensajes) {
      botones.forEach((boton) => {
        boton.innerHTML = "Ver Mensajes";
      });
    } else {
      botones.forEach((boton) => {
        boton.innerHTML = "Ocultar Mensajes";
      });

    }
    setMostrarMensajes(!mostrarMensajes);
    setAsistenciaId(key)


  }

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
    socket.on("newAsistencia", newAsistencia => {
      
      return () => socket.off("newAsistencia")
    })
  },)


    useEffect(() => {
      socket.on("message", message => {
        const { body: { userMessage: { EmisorId } } } = message
        const { body: { userMessage: { Mensaje } } } = message
        const newData = data.map((x, i) => {
          if (x.AsistenciaId === EmisorId) {
            x.Mensajes.push({ Mensaje })
            x.MensajesNoLeidos = false
          }
          return x

        })
        setData(newData)

        return () => socket.off("message");

      })
    },)


    useEffect(() => {
      try {
        const url = `http://chat-backend.escotel.mx:5000/api/chatsCabina`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
      }

      catch (error) {
        console.log(error)
      }


    }, []);


    useEffect(() => {
      const dataSource = data.map((x, i) => ({
        AsistenciaId: x.AsistenciaId,
        Mensajes: x.Mensajes[x.Mensajes.length - 1].Mensaje,
        MensajesNoLeidos: !x.MensajesNoLeidos ? "Tienes  mensajes sin leer" : "No tienes mensajes nuevos",
        key: x.AsistenciaId,
        Acciones: (
          <Button type="primary" id="botones" onClick={handleClick}>
            Ver Mensajes
          </Button>

        ),
      }
      ));
      setDataTable(dataSource)

    }, [data])


    if (data.length === 0) {
      return <Loading />;
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

          {mostrarMensajes ? <Chat valueId={asistenciaId} /> : null}
        </Col>
      </Row>

    );

  };
  export default Home;
