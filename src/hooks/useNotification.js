import { notification } from 'antd';



import React, { useEffect } from 'react'

const useNotification = ( ) => {

    const [api, contextHolder] = notification.useNotification();

console.log("useNotification")

    const openNotification   = description =>{
        console.log("sendNotificacion")
            api.info({
              message: `Notification bottomRight`,
              description,
              placement:'bottomRight',
              duration: 2
            });
    }

    return { openNotification  }

}

export default useNotification