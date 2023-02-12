import { Alert, Space, Spin } from 'antd';

export default function Loading() {
  return (
    <>
      <Space
        direction="vertical"
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20%",
          
        }}
      >
        <Space>
          <Spin tip="Loading" style={{fontSize:"30px" }} size="large">
            <div className="content" />
          </Spin>
        </Space>
      </Space>
    </>
  );
}
