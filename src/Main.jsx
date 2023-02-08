import { Row, Col, Space, Table, Tag, Button, notification } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { useEffect, useLayoutEffect, useState } from 'react';
import Chat from './component/Mensajes';
import Notificacion from './component/Notificacion';
import io from 'socket.io-client';
import StaticContext from './context/StaticContext';
import { useFetch } from './helpers/useFetch';
import { Tabla } from './component/Tabla';
import useNotification from './hooks/useNotification'; 
//Conexion a la bd 
//const socket = io('http://localhost:4000')

function App() {

  const [abrirMensaje, setAbrirMensaje] = useState(false);
  const [notificacion, setNotificacion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mensajes, setMensajes] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);

  const [columns1, setColums1] = useState({
    title: 'Id',
    dataIndex: 'key',
    title: 'Fecha',
    dataIndex: 'EmisorNombre',
    title: 'Mensaje',
    dataIndex: 'Mensaje',
    title: 'No Leido/Leido',
    dataIndex: 'Leido ',


  });
  
  const {mensajesAsistencia} = useFetch('AIH_033')
  console.log("Desde Chat", mensajesAsistencia);
   


   useEffect(() => {
  }, [abrirMensaje])

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (description) => {
    api.info({
      message: `Notification`,
      description,
      placement:'bottomRight',
      duration:2
    });
  };


  return (
    <>  
    <Button onClick={() => openNotification("Hola mundo")}>Notificacion</Button>
      <Row gutter={[4, 0]}>

      <Col xl={24} ls={24} style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }} >
        {<Notificacion /> ? null : <Notificacion />}
      </Col>
      <Col
        //condicional para mostrar el chat
        xs={abrirMensaje ? 18 : 24}
        sm={abrirMensaje ? 18 : 24}
        md={abrirMensaje ? 18 : 24}
        lg={abrirMensaje ? 19 : 24}
        xl={abrirMensaje ? 19 : 24}
        style={{}} >
     
      </Col>
      <Tabla mensajesAsistencia={mensajesAsistencia[0]}/>
      
      

    </Row>

    </>

  );

}

export default App;
