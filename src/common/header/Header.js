import * as React from "react";
import { useState } from "react";
import "./Header.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import { Link, TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const Header = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [username, setUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerClicked, setRegisterClicked] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // for clearing the local storage before closing the tab
  window.onbeforeunload = function () {
    localStorage.clear();
  };

  if (props.pageName === "Details")
    return (
      <div className="header">
        <svg
          className="logo"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          enableBackground="new 0 0 512 512"
        >
          <path
            d="M352,255.5l-192,96v-192L352,255.5z M512,31.5v448H0v-448H512z M320,95.5h64v-32h-64V95.5z M224,95.5h64v-32h-64V95.5z
	            M128,95.5h64v-32h-64V95.5z M32,95.5h64v-32H32V95.5z M96,415.5H32v32h64V415.5z M192,415.5h-64v32h64V415.5z M288,415.5h-64v32h64
	            V415.5z M384,415.5h-64v32h64V415.5z M480,415.5h-64v32h64V415.5z M480,127.5H32v256h448V127.5z M480,63.5h-64v32h64V63.5z"
          />
        </svg>
        <Button
          variant="contained"
          color="inherit"
          style={{ float: "right" }}
          onClick={() => {
            isLoggedIn ? setIsLoggedIn(false) : handleOpen();
          }}
        >
          {isLoggedIn ? "LOGOUT" : "LOGIN"}
        </Button>
        <Button
          href={`/bookshow/${props.movieId}`}
          variant="contained"
          style={{
            backgroundColor: "#3452B4",
            float: "right",
            marginRight: "13px",
          }}
        >
          BOOK SHOW
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Tabs
              centered={true}
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab centered={true} label="LOGIN" {...a11yProps(0)} />
              <Tab centered={true} label="REGISTER" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={value} index={0} dir={theme.direction}>
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Username"
                  variant="standard"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  helperText={loginClicked && username === "" ? "required" : ""}
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Password"
                  variant="standard"
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                  helperText={
                    loginClicked && loginPassword === "" ? "required" : ""
                  }
                />
              </FormControl>
              <p
                style={{ margin: 0, padding: 0, display: "none" }}
                id="error_msg"
              ></p>
              <br />
              <FormControl>
                <Button
                  id="login_button"
                  variant="contained"
                  style={{
                    backgroundColor: "#3452B4",
                    marginTop: "40px",
                  }}
                  onClick={() => {
                    setLoginClicked(true);
                    if (!username || !loginPassword) return;
                    fetch("http://localhost:8085/api/auth/login", {
                      method: "POST",
                      headers: {
                        Authorization:
                          "Basic " +
                          window.btoa(username + ":" + loginPassword),
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                      },
                      body: null,
                    })
                      .then((response) => response.json())
                      .then((response) => {
                        sessionStorage.setItem("uuid", response.id);

                        if (response.headers.get("access-token") == null) {
                          sessionStorage.setItem(
                            "access-token",
                            response["access-token"]
                          );
                        }
                        setIsLoggedIn(true);
                        document.getElementById("error_msg").style.display =
                          "hidden";
                        handleClose();
                      })
                      .catch((error) => {
                        document.getElementById("error_msg").innerText = error;
                        document.getElementById("error_msg").style.display =
                          "block";
                        document.getElementById(
                          "login_button"
                        ).style.marginTop = "2px";
                      });
                  }}
                >
                  LOGIN
                </Button>
              </FormControl>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="First Name"
                  variant="standard"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  helperText={
                    registerClicked && firstName === "" ? "required" : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Last Name"
                  variant="standard"
                  required
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  helperText={
                    registerClicked && lastName === "" ? "required" : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Email"
                  variant="standard"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  helperText={
                    registerClicked && email === ""
                      ? "required"
                      : registerClicked &&
                        (!email.includes("@") || !email.includes("."))
                      ? "invalid email"
                      : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Password"
                  variant="standard"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  helperText={
                    registerClicked && password === "" ? "required" : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Contact No."
                  variant="standard"
                  required
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                  }}
                  helperText={
                    registerClicked && contact === ""
                      ? "required"
                      : registerClicked &&
                        (isNaN(contact) || contact.length !== 10)
                      ? "invalid contact number"
                      : ""
                  }
                />
              </FormControl>
              <p
                style={{ margin: 0, padding: 0, display: "none" }}
                id="success_msg"
              >
                Registration Successful. Please Login!
              </p>
              <br />
              <FormControl>
                <Button
                  id="register_button"
                  variant="contained"
                  style={{
                    backgroundColor: "#3452B4",
                    marginTop: "40px",
                  }}
                  onClick={() => {
                    setRegisterClicked(true);
                    if (firstName && lastName && email && password && contact) {
                      if (
                        email.includes("@") &&
                        email.includes(".") &&
                        !isNaN(contact) &&
                        contact.length === 10
                      ) {
                        let obj = JSON.stringify({
                          email_address: email,
                          first_name: firstName,
                          last_name: lastName,
                          mobile_number: contact,
                          password: password,
                        });
                        fetch("http://localhost:8085/api/auth/signup", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache",
                          },
                          body: obj,
                        })
                          .then((response) => response.json())
                          .then((response) => {
                            document.getElementById(
                              "success_msg"
                            ).style.display = "block";
                            document.getElementById(
                              "register_button"
                            ).style.marginTop = "2px";
                          })
                          .catch((error) => {
                            console.error("Error:", error);
                          });
                      }
                    }
                  }}
                >
                  REGISTER
                </Button>
              </FormControl>
            </TabPanel>
          </Box>
        </Modal>
      </div>
    );
  else if (props.pageName === "Home")
    return (
      <div className="header">
        <svg
          className="logo"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          enableBackground="new 0 0 512 512"
        >
          <path
            d="M352,255.5l-192,96v-192L352,255.5z M512,31.5v448H0v-448H512z M320,95.5h64v-32h-64V95.5z M224,95.5h64v-32h-64V95.5z
	            M128,95.5h64v-32h-64V95.5z M32,95.5h64v-32H32V95.5z M96,415.5H32v32h64V415.5z M192,415.5h-64v32h64V415.5z M288,415.5h-64v32h64
	            V415.5z M384,415.5h-64v32h64V415.5z M480,415.5h-64v32h64V415.5z M480,127.5H32v256h448V127.5z M480,63.5h-64v32h64V63.5z"
          />
        </svg>
        <Button
          variant="contained"
          color="inherit"
          style={{ float: "right" }}
          onClick={() => {
            isLoggedIn ? setIsLoggedIn(false) : handleOpen();
          }}
        >
          {isLoggedIn ? "LOGOUT" : "LOGIN"}
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Tabs
              centered={true}
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab centered={true} label="LOGIN" {...a11yProps(0)} />
              <Tab centered={true} label="REGISTER" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={value} index={0} dir={theme.direction}>
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Username"
                  variant="standard"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  helperText={loginClicked && username === "" ? "required" : ""}
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Password"
                  variant="standard"
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                  helperText={
                    loginClicked && loginPassword === "" ? "required" : ""
                  }
                />
              </FormControl>
              <p
                style={{ margin: 0, padding: 0, display: "none" }}
                id="error_msg"
              ></p>
              <br />
              <FormControl>
                <Button
                  id="login_button"
                  variant="contained"
                  style={{
                    backgroundColor: "#3452B4",
                    marginTop: "40px",
                  }}
                  onClick={() => {
                    setLoginClicked(true);
                    if (!username || !loginPassword) return;
                    if (!localStorage.getItem(username)) {
                      document.getElementById("error_msg").innerText =
                        "User doesn't exist. Please register";
                      document.getElementById("error_msg").style.display =
                        "block";
                      document.getElementById("login_button").style.marginTop =
                        "2px";
                      return;
                    }
                    if (
                      JSON.parse(localStorage.getItem(username)).password !==
                      loginPassword
                    ) {
                      document.getElementById("error_msg").innerText =
                        "Incorrect password";
                      document.getElementById("error_msg").style.display =
                        "block";
                      document.getElementById("login_button").style.marginTop =
                        "2px";
                      return;
                    }
                    setIsLoggedIn(true);
                    document.getElementById("error_msg").style.display =
                      "hidden";
                    handleClose();
                  }}
                >
                  LOGIN
                </Button>
              </FormControl>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="First Name"
                  variant="standard"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  helperText={
                    registerClicked && firstName === "" ? "required" : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Last Name"
                  variant="standard"
                  required
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  helperText={
                    registerClicked && lastName === "" ? "required" : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Email"
                  variant="standard"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  helperText={
                    registerClicked && email === ""
                      ? "required"
                      : registerClicked &&
                        (!email.includes("@") || !email.includes("."))
                      ? "invalid email"
                      : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Password"
                  variant="standard"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  helperText={
                    registerClicked && password === "" ? "required" : ""
                  }
                />
              </FormControl>
              <br />
              <FormControl className="modal_fields">
                <TextField
                  className="modal_inputs"
                  id="standard-basic"
                  label="Contact No."
                  variant="standard"
                  required
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                  }}
                  helperText={
                    registerClicked && contact === ""
                      ? "required"
                      : registerClicked &&
                        (isNaN(contact) || contact.length !== 10)
                      ? "invalid contact number"
                      : ""
                  }
                />
              </FormControl>
              <p
                style={{ margin: 0, padding: 0, display: "none" }}
                id="success_msg"
              >
                Registration Successful. Please Login!
              </p>
              <br />
              <FormControl>
                <Button
                  id="register_button"
                  variant="contained"
                  style={{
                    backgroundColor: "#3452B4",
                    marginTop: "40px",
                  }}
                  onClick={() => {
                    setRegisterClicked(true);
                    if (firstName && lastName && email && password && contact) {
                      if (
                        email.includes("@") &&
                        email.includes(".") &&
                        !isNaN(contact) &&
                        contact.length === 10
                      ) {
                        let obj = {
                          firstName: firstName,
                          lastname: lastName,
                          email: email,
                          password: password,
                          contact: contact,
                        };
                        localStorage.setItem(
                          firstName + " " + lastName,
                          JSON.stringify(obj)
                        );
                        document.getElementById("success_msg").style.display =
                          "block";
                        document.getElementById(
                          "register_button"
                        ).style.marginTop = "2px";
                      }
                    }
                  }}
                >
                  REGISTER
                </Button>
              </FormControl>
            </TabPanel>
          </Box>
        </Modal>
      </div>
    );
};
