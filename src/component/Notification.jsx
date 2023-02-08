  import { Button, notification, Space } from 'antd';
  import MailOutlined from '@ant-design/icons/MailOutlined';

  const Notification = (value) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
      api.info({
        message: `Notificacion ${"Mensaje"}`,
        description:
         (value?"Tienes mensajes sin leer":"No tienes mensajes en tu chat" ) ,
        placement,
      });
      
    };
    return (
      <>
        {contextHolder}
        <Space>
          <Button type="primary" onClick={ openNotification('left')} icon={<MailOutlined />}>
            Tienes mensajes sin leer
          </Button>
         
        </Space>
      </>
    );
  };
  export default Notification;