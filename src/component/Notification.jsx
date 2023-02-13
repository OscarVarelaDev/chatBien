  import { Button, message, notification, Space } from 'antd';
  import MailOutlined from '@ant-design/icons/MailOutlined';

  const Notification = ({text}) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
      api.info({
        message: `Notificacion ${"Mensaje"}`,
        description: text ,
        duration: 2,
        placement,
      });
      
    };
    return (
      <>
        {contextHolder}
        <Space>
          <Button type="primary" style={{
            width: "250px",
            height: "100%",
            maxHeight: "100%",
            maxWidth: "100%",
          }} onClick={ openNotification('bottomLeft')} icon={<MailOutlined />}>
            {text}

          </Button>
         
        </Space>
      </>
    );
  };
  export default Notification;