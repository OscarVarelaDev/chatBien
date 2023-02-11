import { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import MostrarMensajes from "../../component/MostrarMensajes";


function Chat({asistenciaId,dataAllMessage}) {
  const [isLoading, setIsLoading] = useState(true);

  
  return (
    <>
      {isLoading ? <MostrarMensajes dataAllMessage={dataAllMessage}  asistenciaId={asistenciaId}/>:null}
    </>
  );
}

export default Chat;
