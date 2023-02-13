import { Avatar, Card } from "antd";
import { UserOutlined } from '@ant-design/icons';
const { Meta } = Card;

export default function Message(dataMessages ) {
   
    return(
        <>
        <Card >      
            
            <Meta style={{ width: "100%",color:"black"}}
              avatar={<Avatar shape="square" gap={"6"} size="large"   icon={<UserOutlined />} />} 
              title= {dataMessages.EmisorNombre}
              description={"Mensaje:"+dataMessages.Mensaje}
            />
            {<p style={{
                fontSize: "12px",
                color: "black",
                textAlign: "left",
                marginTop: "20px",
                marginRight: "5px",
                fontWeight: "bold"
                
            }}>Mensaje enviado: {dataMessages.Fecha}</p>
            
            }
        </Card>
      
        </>
    )
}