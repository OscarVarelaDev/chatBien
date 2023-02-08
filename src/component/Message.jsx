import { Avatar, Card } from "antd";
import { UserOutlined } from '@ant-design/icons';
const { Meta } = Card;

export default function Message(props) {
    return(
        <Card style={{ width: "75%" }}>

            <Meta
              avatar={<Avatar shape="square" gap={"5"} size="large"  icon={<UserOutlined />} />} 
              title= {props.EmisorNombre}
              description={props.Mensaje}
            />

        </Card>
    )
}