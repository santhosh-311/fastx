import React, { useContext, useEffect, useState } from "react";
import { Modal, Descriptions, Button, Tag, message, Card, Row, Col, Typography } from "antd";
import {  CalendarOutlined, CarOutlined, PhoneOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import DataContext from "./context/DataContext";

const LastBooking = ({id}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [details, setDetails] = useState(null);
  const BASE_URL = "http://localhost:8084";
  const{token}=useContext(DataContext);


  const fetchLastBookingDetails = async () => {
      try {
        if (!token) {
          throw new Error("Authorization token is missing.");
        }
        const response = await axios.get(`${BASE_URL}/booking/admin/allbookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("user:",id);
        const allBookings = response.data;
        console.log("All bookings:", allBookings);
    
        const userBookings = allBookings.filter((booking) => booking.user.userId === id);
    
        console.log(`Booking details of user: ${id}`, userBookings);
    
        if (userBookings.length > 0) {
          const lastBooking = userBookings.sort((a, b) => new Date(b.journeyDate) - new Date(a.journeyDate))[0];
          setDetails(lastBooking)
          console.log("Last booking for user:", lastBooking);
        } else {
            message.error("No bookings found")
          console.log(`No bookings found for user ID: ${id}`);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    };

  useEffect(() => {
    if (isModalVisible) fetchLastBookingDetails();
  }, [isModalVisible]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* <Button type="primary" icon={<EyeTwoTone/>} /> */}
        <EyeTwoTone onClick={() => {
        fetchLastBookingDetails();
        setIsModalVisible(true)}}/>
      {details && (
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CarOutlined />
              Last Booking Details
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          centered
          footer={null}
        >
          {/* Bus Details Section */}
          <Card style=
          {{ backgroundColor: "#fafafa", 
          marginBottom: "20px", 
          borderRadius: "12px", 
          padding: "10px"}}
            >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title level={4} style={{ marginTop:"0", marginBottom: "5px", color: "#333" }}>
                        Bus Details
                    </Typography.Title>
                </Col>
                <Col span={12}>
                    <Typography.Text strong style={{ display: "block", color: "#555" }}>
                        {details?.bus.busName || "N/A"}
                    </Typography.Text>
                </Col>
                <Col span={12}>
                    <Tag color="purple" style={{ marginTop: "4px" }}>
                        {details?.bus.busType || "N/A"}
                    </Tag>
                </Col>
                <Col span={12}>
                    <Typography.Text style={{ display: "block", color: "#777" }}>
                        {details?.bus.busNumber || "N/A"}
                    </Typography.Text>
                </Col>
                <Col span={12}>
                    <Typography.Text style={{ display: "block", color: "#555", fontWeight:"600" }}>
                        {details?.bus.route.routeFrom || "N/A"} → {details?.bus.route.routeTo || "N/A"}
                    </Typography.Text>
                </Col>
                <Col span={24}>
                    <Typography.Text strong style={{ color: "#555" }}>Operator Mobile Number:</Typography.Text>
                    <Typography.Text style={{ display: "block", color: "#777" }}>
                        <PhoneOutlined style={{ marginRight: "5px", color: "#1890ff" }} />
                        {details?.bus.user.number || "N/A"}
                    </Typography.Text>
                </Col>
            </Row>
            </Card>


          {/* Booking Details Section */}
          <Descriptions style={{ marginBottom: "30px" }} bordered column={1} title="Booking Details">
            <Descriptions.Item label="Booked Seats">
              <Tag color="green">{details?.seatInfo || "N/A"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Journey Date">{details?.bus.date || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Booking Date">{details?.bookingDate || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Timing">
              <CalendarOutlined style={{ marginRight: "5px" }} />
              Arrival: <strong>{details?.bus.arrival || "N/A"}</strong>, Departure: <strong>{details?.bus.departure || "N/A"}</strong>
            </Descriptions.Item>
          </Descriptions>

          <Button key="cancel" danger onClick={handleCancel} style={{ marginTop: "10px" }}>
            Close
          </Button>
        </Modal>
      )}
    </>
  );
};

export default LastBooking;
