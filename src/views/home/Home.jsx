import Chat from "./Chat";
import { Row, Col, Table, Button } from "antd";
import { useEffect, useState } from "react";
import Notification from "../../component/Notification";
import Loading from "../../component/Loading";


const Home = () => {
  const [data, setData] = useState([]);
  const [asistenciaId, setAsistenciaId] = useState("");
  const [mostrarMensajes, setMostrarMensajes] = useState(false);
  const [tienesMensajes,setTienesMensajes] = useState(true);



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
  
  };

  const columns = [
    {
      title: "Asistencia Id",
      dataIndex: "AsistenciaId",
      key: "AsistenciaId",
    },
    {
      title: "Mensajes",
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
      setTienesMensajes(false)

    },[tienesMensajes])

  useEffect(() => {
    
    try{
    const url = `http://localhost:4000/api/chats`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
       setData(data);
      })
    }
    catch(error){
      console.log(error)
    }

  }, []);



  if (!data) {
    return <Loading/>;
  }
 

  const dataSource = data.map((x, i) => ({
    
    AsistenciaId: x.AsistenciaId,
    Mensajes: x.Mensajes[x.Mensajes.length - 1].Mensaje,
    MensajesNoLeidos: x.MensajesNoLeidos===true ?<Notification/>: "No tienes mensajes nuevos",
    key: x.AsistenciaId,
    Acciones: (
      <Button type="primary"  id="botones" onClick={handleClick}>
        Ver Mensajes
      </Button>
      
    ),
  }
  ));
  console.log(dataSource)

  return (
    <Row>
      <Col
        xs={mostrarMensajes ? 16 : 24}
        sm={mostrarMensajes ? 16 : 24}
        md={mostrarMensajes ? 16 : 24}
        lg={mostrarMensajes ? 16 : 24}
        xl={mostrarMensajes ? 16 : 24}
      >
        <Table className="rowChats" columns={columns} rowKey={x => x.AsistenciaId} dataSource={dataSource} />
     
      </Col>
      <Col
        xs={mostrarMensajes ? 8 : 0}
        sm={mostrarMensajes ? 8 : 0}
        md={mostrarMensajes ? 8 : 0}
        lg={mostrarMensajes ? 8 : 0}
        xl={mostrarMensajes ? 8 : 0}
      >

        {mostrarMensajes ? <Chat valueId={asistenciaId} /> : null}
      </Col>
    </Row>
  );

};
export default Home;
