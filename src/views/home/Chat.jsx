import { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import MostrarMensajes from "../../component/MostrarMensajes";


function Chat({asistenciaId,
  dataAllMessage,
   setOcultarChat,
   setMostrarMensajes,
   mostrarMensajes,
   handleClick,
   setNotification
   
  }) {
  const [isLoading, setIsLoading] = useState(true);

  
  return (
    <>
      {isLoading ? <MostrarMensajes
       dataAllMessage={dataAllMessage} 
         asistenciaId={asistenciaId}
         setOcultarChat={setOcultarChat}
         setMostrarMensajes={setMostrarMensajes}
         mostrarMensajes={mostrarMensajes}
         handleClick={handleClick}
        
         />:null}
    </>
  );
}

export default Chat;
