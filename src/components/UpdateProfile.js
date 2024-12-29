import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, message,Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import Header from "./Header";
import DataContext from "./context/DataContext";
import '../styles/UpdateProfile.css'
import Footer from "./Footer";
import moment from 'moment';

const BASE_URL = "http://localhost:8084/";

const UpdateProfile = () => {
  const { userDetails, token } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  const genderOptions=["Male","Female","Other"];


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}user/getuser/${userDetails.userName}`, {
          headers: { Authorization: `Bearer ${token}`},
        });
        setUser(response.data);
      } catch (error) {
        message.error("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userDetails.userName, token]);

  const handleUpdateDetails = async (values) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}user/update/${userDetails.userName}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      message.success("User details updated successfully!");
    } catch (error) {
      message.error("Failed to update user details.");
      message.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}user/updatepwd/${userDetails.userName}/${values.currentPassword}/${values.newPassword}`,
        {},
        {
          headers: { Authorization: `Bearer ${token} `},
        }
      );
      message.success("Password updated successfully!");
    } catch (error) {
      message.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: "20px", maxWidth: "900px", margin: "10px 60px 20px" }}>
      <div className="top-btn-container">
                <button className={`top-btn ${activeTab === "details" ? "active" : "inactive"}`}
                    onClick={() => setActiveTab("details")}>
                    Update Details
                </button>
                <button className={`top-btn ${activeTab === "password" ? "active" : "inactive"}`}
                    onClick={() => setActiveTab("password")}>
                    Change Password
                </button>
            </div>
        { activeTab==="details"? user ? (
          <Form
            layout="vertical"
            initialValues={user}
            onFinish={handleUpdateDetails}
            style={{ margin: "20px" }}
          >
            <div className="form-container">
              <div className="form-left">
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Name is required." },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: "Name can only contain alphabets and spaces.",
                  },
                  {
                    validator(_, value) {
                      if (value && value.length >= 5) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Name must be at least 5 characters long.")
                      );
                    },
                  },
                ]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required." }]}
            >
              <Input placeholder="Enter your email" disabled />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="number"
              rules={[
                { required: true, message: "Phone number is required." },
                { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number." },
              ]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Date of Birth (YYYY-MM-DD)&nbsp;
                  <Tooltip
                    title={
                      <>
                        Date of Birth must meet the following criteria:
                        <br /> - You must be at least 18 years old
                        <br /> - Age must be less than 80 years
                      </>
                    }
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
              name="dob"
              rules={[
                { required: true, message: "Date of birth is required." },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const dob = moment(value, "YYYY-MM-DD", true);
                    if (!dob.isValid()) {
                      return Promise.reject(
                        new Error("Please enter a valid date in the format YYYY-MM-DD.")
                      );
                    }
                    const age = moment().diff(dob, "years");
                    if (age < 18) {
                      return Promise.reject(new Error("You must be at least 18 years old."));
                    }
                    if (age >= 80) {
                      return Promise.reject(new Error("Age must be less than 80 years."));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input placeholder="Enter your Date of Birth" />
            </Form.Item>



            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Gender is required." }]}
            >
              <Select
                options={genderOptions.map((gender) => ({ value: gender }))}
                placeholder="Select gender"
                dropdownStyle={{ width: 200 }}
              />
            </Form.Item>


            </div>
            <div className="form-right">
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please enter your address" },
                {
                  pattern: /^[A-Za-z0-9 ,/-]{5,30}$/,
                  message: "Address should only contain alphabets,spaces,Numbers,/,-,','",
                },
              ]}
            >
              <Input  placeholder="Enter your city" />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              rules={[
                { required: true, message: "Please enter your city" },
                {
                  pattern: /^[A-Za-z ]+$/,
                  message: "City should only contain alphabets and spaces",
                },
              ]}
            >
              <Input  placeholder="Enter your city" />
            </Form.Item>

            <Form.Item
              label="State"
              name="state"
              rules={[
                { required: true, message: "Please enter your state" },
                {
                  pattern: /^[A-Za-z ]+$/,
                  message: "State should only contain alphabets and spaces",
                },
              ]}
            >
              <Input  placeholder="Enter your state" />
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
              rules={[
                { required: true, message: "Please enter your Country" },
                {
                  pattern: /^[A-Za-z ]+$/,
                  message: "Country should only contain alphabets and spaces",
                },
              ]}
            >
              <Input  placeholder="Enter your Country" />
            </Form.Item>

            {userDetails.role === "OPERATOR" && (
              <>
                <Form.Item
                  label="Aadhar"
                  name="aadhar"
                  rules={[{ required: true, message: "Aadhar is required." }]}
                >
                  <Input placeholder="Enter your Aadhar number" disabled />
                </Form.Item>
                <Form.Item
                  label="PAN"
                  name="pan"
                  rules={[{ required: true, message: "PAN is required." }]}
                >
                  <Input placeholder="Enter your PAN number" disabled />
                </Form.Item>
              </>
            )}
            </div>
            </div>
            <Button type="primary" htmlType="submit" loading={loading}>
                {console.log(user)}
              Update Details
            </Button>
          </Form>
        ) : (
          <p>Loading user details...</p>
        )
        :
        <Form layout="vertical"
            onFinish={handleChangePassword}
            style={{ margin: "20px", width:"400px" }}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: "Password is required." }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          
          <Form.Item
                  label={
                    <span>
                      New Password&nbsp;
                      <Tooltip
                        title={
                          <>
                            Password must contain at least:
                            <br /> - 1 uppercase letter
                            <br /> - 1 lowercase letter
                            <br /> - 1 number
                            <br /> - 1 special character
                            <br /> - Must be at least 8 characters long
                          </>
                        }
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  name="newPassword"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Your password does not meet the requirements.",
                    },
                  ]}
                >
            <Input.Password placeholder="Enter new password" visibilityToggle={false} />
          </Form.Item>
          <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: "Please confirm your password." },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" visibilityToggle={false} />
            </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Change Password
          </Button>
        </Form>
      }
      </div>
      <Footer/>
    </>
  );
};

export default UpdateProfile;