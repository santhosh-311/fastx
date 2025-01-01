import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Button, AutoComplete } from "antd";
import "../styles/SearchForm.css";
import axios from "axios";
import { SwapOutlined, SearchOutlined } from "@ant-design/icons";
import { useContext } from "react";
import DataContext from "./context/DataContext";
import moment from "moment";

const { Option } = Select;

const SearchForm = () => {
  const { routesFrom, routesTo, setBuses, setSearchFlag } = useContext(DataContext);
  const [form] = Form.useForm();
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  const BASE_URL = "http://localhost:8084/";

  // useEffect(() => {
  //   const fetchRoutes = async () => {
  //     try {
  //       const res = await axios.get(BASE_URL + "route/getall");
  //       const routesData = res.data;
  //       const routesFromData = [...new Set(routesData.map((r) => r.routeFrom))];
  //       const routesToData = [...new Set(routesData.map((r) => r.routeTo))];

  //       setRoutesFrom(routesFromData);
  //       setRoutesTo(routesToData);
  //     } catch (err) {
  //       console.error("Error during route loading:", err);
  //     }
  //   };

  //   fetchRoutes();
  // }, []);

  const handleSourceChange = (value) => {
    const filteredOptions = routesFrom.filter((route) =>
      route.toLowerCase().includes(value.toLowerCase())
    );
    setSourceOptions(filteredOptions.map((route) => ({ value: route })));
  };

  const handleDestinationChange = (value) => {
    const filteredOptions = routesTo.filter((route) =>
      route.toLowerCase().includes(value.toLowerCase())
    );
    setDestinationOptions(filteredOptions.map((route) => ({ value: route })));
  };

  const handleSwap = () => {
    const source = form.getFieldValue("source");
    const destination = form.getFieldValue("destination");

    form.setFieldsValue({
      source: destination,
      destination: source,
    });
  };

  const onFinish = (values) => {
    const newValues = { ...values, date: values.date.format("YYYY-MM-DD") };
    const { source, destination, date, type } = newValues;
    const getBuses = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}bus/searchbus/${source}/${destination}/${date}/${type}`
        );
        setBuses(response.data);
      } catch (err) {
        setBuses([]);
        console.error("Error during bus fetch:", err);
      }
    };
    setSearchFlag(true);
    getBuses();
  };

  return (
    <div className="formContainer">
      <Form
        form={form}
        name="search_form"
        onFinish={onFinish}
        layout="inline"
        className="form"
      >
        <div className="form-box">
          <Form.Item
            name="source"
            rules={[{ required: true, message: "Please input the source!" }]}
          >
            <AutoComplete
              className="ip corner"
              options={sourceOptions}
              onSearch={handleSourceChange}
              placeholder="Source"
              style={{ width: 200 }}
            />
          </Form.Item>
          <div style={{ display: "flex", alignItems: "center", margin: "0 10px", position:"absolute", top:"20px", left:"150px", zIndex:"2" }}>
            <Button
              type="default"
              shape="circle"
              icon={<SwapOutlined />}
              onClick={handleSwap}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            />
          </div>
          <Form.Item
            name="destination"
            rules={[
              { required: true, message: "Please input the destination!" },
            ]}
          >
            <AutoComplete
              className="ip dest"
              options={destinationOptions}
              onSearch={handleDestinationChange}
              placeholder="Destination"
            />
          </Form.Item>
          <Form.Item
            name="date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <DatePicker
              className="ip"
              style={{ width: 200 }}
              disabledDate={(current) => current && current < moment().startOf("day")}
            />
          </Form.Item>
          <Form.Item
            name="type"
            rules={[{ required: true, message: "Please select the bus type!" }]}
          >
            <Select placeholder="Select Type" className="ip" style={{ width: 200 }}>
              <Option value="AC_SEATER">AC Seater</Option>
              <Option value="NON_AC_SEATER">Non-AC Seater</Option>
              <Option value="AC_SLEEPER">AC Sleeper</Option>
              <Option value="NON_AC_SLEEPER">Non-AC Sleeper</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              className="search-btn"
              type="primary"
              htmlType="submit"
            >
              <SearchOutlined className="search-icon" />
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default SearchForm;
