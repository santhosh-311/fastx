import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Input, message, Switch, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import DataContext from "./context/DataContext";
import Footer from "./Footer";
import Header from "./Header";
import LastBooking from "./LastBooking";

const ManageUsers = () => {
    const{token}=useContext(DataContext);
  const [isUserMode, setIsUserMode] = useState(true); 
  const [data, setData] = useState([]); 
  const [searchValue, setSearchValue] = useState(""); 

  const BASE_URL = "http://localhost:8084/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}user/admin/allusers`,{headers: { Authorization: `Bearer ${token}`},});
        isUserMode?setData(response.data.filter((user)=>user.roles==="USER")):setData(response.data.filter((user)=>user.roles==="OPERATOR"))
        console.log(response.data)
      } catch (err) {
        message.error("Error fetching data");
      }
    };
    fetchData();

  }, [token,isUserMode]);

  const handleDelete = async (userName) => {
    try {
      console.log(userName)
      await axios.delete(`${BASE_URL}user/admin/delete/${userName}`,{
        headers: { Authorization: `Bearer ${token}`},
      });
      message.success("Deleted successfully");
      setData(data.filter((item) => item.email !== userName)); 
    } catch (err) {
      message.error("Error deleting item");
    }
  };

  const columns = isUserMode
    ? [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Number", dataIndex: "number", key: "number" },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <>
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record.email)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
            <LastBooking id={record.userId}/>
            </>
          ),
        },
      ]
    : [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Number", dataIndex: "number", key: "number" },
        { title: "PAN", dataIndex: "pan", key: "pan" },
        { title: "Aadhar", dataIndex: "aadhar", key: "aadhar" },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Popconfirm
              title="Are you sure to delete this operator?"
              onConfirm={() => handleDelete(record.email)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          ),
        },
      ];

  return (
    <>
    <Header/>
    <div style={{ padding: "20px" }}>
      <h2>Manage {isUserMode ? "Users" : "Operators"}</h2>
      <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
        <Switch
          checkedChildren="User"
          unCheckedChildren="Operator"
          onChange={(checked) => setIsUserMode(checked)}
          defaultChecked
        />
        <Input
          placeholder={`Search by ${isUserMode ? "name/email" : "name"}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>
      <Table style={{overflowY:"auto"}}
        columns={columns}
        dataSource={data.filter((item) =>item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.email.toLowerCase().includes(searchValue.toLowerCase())
        )
    }
        rowKey="id"
        pagination={false}
      />
    </div>
    <Footer/>
    </>
    
  );
};

export default ManageUsers;