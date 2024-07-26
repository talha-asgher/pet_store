import { useState } from "react";
import React, { useEffect } from "react";
import { Layout, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./welcome.css";
import sign from "jwt-encode";
import { jwtDecode } from "jwt-decode";

const { Header, Content, Footer } = Layout;

export default function Welcome() {
  const [Users, setUsers] = useState([
    { name: "talha", password: "triton", email: "talha.a.bajwa222@gmail.com" },
    { name: "Laiba", password: "panda", email: "laibaatique55@gmail.com" },
  ]);

  const [isLogin, setLogin] = useState(false);
  const [isSignin, setSignin] = useState(false);
  const [isHome, setHome] = useState(true);
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPasswordConfirm, setShowSignupPasswordConfirm] =
    useState(false);

  const navigate = useNavigate();

  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const secret = generateRandomString(32);

  function generateJWT(user) {
    const data = {
      name: user.name,
      password: user.password,
    };

    const jwt = sign(data, secret);
    return jwt;
  }

  const updateTokens = (updatedUserNames) => {
    const updatedTokens = updatedUserNames.map((user) => ({
      ...user,
      JWT: generateJWT(user),
    }));
    setUsers(updatedTokens);
    storeTokens(updatedTokens); // Store updated tokens in localStorage
  };

  // Function to store tokens in localStorage
  function storeTokens(users) {
    const tokens = users.map((user) => user.JWT);
    localStorage.setItem("userTokens", JSON.stringify(tokens));
  }

  // Initial generation of tokens when component mounts
  useEffect(() => {
    updateTokens(Users);
  }, []);

  useEffect(() => {
    const userIndex = JSON.parse(localStorage.getItem("userIndex"));
    if (userIndex !== undefined) {
      updateTokens(Users);
      localStorage.removeItem("userIndex");
    }
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [isLogin, isSignin, isHome]);

  function signFunc() {
    setHome(false);
    setLogin(false);
    setSignin(true);
  }

  function logFunc() {
    setHome(false);
    setSignin(false);
    setLogin(true);
  }

  function navigateFunc() {
    navigate("/home");
  }

  function handleLogin() {
    const storedTokens = JSON.parse(localStorage.getItem("userTokens")) || [];

    function decodeAllStoredTokens(storedTokens, secret) {
      const decodedDataArray = storedTokens.map((jwtToken) => {
        try {
          const decoded = jwtDecode(jwtToken, secret);
          return {
            jwt: jwtToken,
            name: decoded.name,
            password: decoded.password,
          };
        } catch (error) {
          console.error("Error decoding JWT:", error);
          return null; // or handle the error as needed
        }
      });

      return decodedDataArray.filter((data) => data !== null); // Filter out any null entries
    }

    const decodedArray = decodeAllStoredTokens(storedTokens, secret);
    const foundUser = decodedArray.find(
      (user) => user.name.toLowerCase() === loginName.toLowerCase()
    );

    if (!foundUser) {
      setErrorMessage("User not found");
      return;
    }

    if (loginName === "" || loginPassword === "") {
      setErrorMessage("Enter your complete credentials");
      return;
    }

    if (foundUser.password !== loginPassword) {
      setErrorMessage("Incorrect password");
    } else {
      localStorage.setItem("isAuthenticated", "true");
      navigateFunc();
    }
  }

  function handleSignup() {
    if (
      !signupName ||
      !signupPassword ||
      !signupEmail ||
      !signupPasswordConfirm
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const userExists = Users.some(
      (user) => user.name.toLowerCase() === signupName.toLowerCase()
    );
    const emailExists = Users.some(
      (user) => user.email.toLowerCase() === signupEmail.toLowerCase()
    );
    if (userExists) {
      setErrorMessage("Username already exists.");
    } else if (emailExists) {
      setErrorMessage("Email already exists.");
    } else {
      const newAnimal = {
        name: signupName,
        password: signupPassword,
        email: signupEmail,
      };
      const newUserData = [...Users, newAnimal];
      setUsers(newUserData);
      updateTokens(newUserData);
      setErrorMessage("Sign up successful! You can now log in.");
      setSignin(false);
      setLogin(true);
    }
  }

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "center", color: "white" }}> Pet Store </h1>
      </Header>
      <Content style={{ padding: "0 43px" }}>
        <h2>Welcome to the Pet store</h2>
        <div
          style={{
            padding: 26,
            paddingBottom: 40,
            paddingLeft: 900,
            minHeight: 700,
            backgroundImage:
              'url("https://www.phoenixmag.com/wp-content/uploads/2022/01/cute-pets-1280x720.jpg")',
          }}
        >
          <div
            className="sized-div"
            style={{
              backgroundImage: `url(https://www.shutterstock.com/image-photo/kitten-jumping-isolated-on-white-260nw-56474257.jpg)`,
              backgroundSize: "50% 25%",
              backgroundPosition: "bottom right",
              backgroundRepeat: "no-repeat",
            }}
          >
            {isHome && (
              <>
                <h2 style={{ marginTop: 70 }}>Please Sign up or Log in</h2>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "60px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={signFunc}
                >
                  Sign Up
                </Button>
                <h2
                  style={{
                    marginTop: "50px",
                    marginLeft: "30px",
                  }}
                >
                  OR
                </h2>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "30px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={logFunc}
                >
                  Log in
                </Button>
              </>
            )}
            {isLogin && (
              <>
                <h2 style={{ marginTop: 40 }}>Log In</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <label style={{ marginTop: "60px", marginRight: "230px" }}>
                  Name :
                </label>
                <Input
                  placeholder="Name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  style={{ marginTop: "20px", margin: "10px" }}
                />
                <label style={{ marginTop: "40px", marginRight: "200px" }}>
                  Password :
                </label>
                <Input
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  type={showLoginPassword ? "text" : "password"}
                  style={{ marginTop: "50px", margin: "10px" }}
                  addonAfter={
                    <Button
                      type="text"
                      icon={
                        showLoginPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    />
                  }
                />
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "30px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={handleLogin}
                >
                  Log in
                </Button>
                <p
                  style={{
                    marginTop: "30px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                >
                  Not registered?
                </p>
                <Button
                  type="default"
                  size="small"
                  style={{
                    marginTop: "10px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={signFunc}
                >
                  Sign Up
                </Button>
              </>
            )}
            {isSignin && (
              <>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    setHome(true);
                    setSignin(false);
                  }}
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    fontSize: "16px",
                  }}
                />
                <h2>Sign Up</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <label style={{ marginTop: "20px", marginRight: "225px" }}>
                  Name :
                </label>
                <Input
                  placeholder="Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  style={{ marginTop: "10px", margin: "10px" }}
                />
                <label style={{ marginTop: "40px", marginRight: "210px" }}>
                  Password :
                </label>
                <Input
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  type={showSignupPassword ? "text" : "password"}
                  style={{ marginTop: "50px", margin: "10px" }}
                  addonAfter={
                    <Button
                      type="text"
                      icon={
                        showSignupPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    />
                  }
                />
                <label style={{ marginTop: "40px", marginRight: "150px" }}>
                  Confirm Password :
                </label>
                <Input
                  placeholder="Confirm Password"
                  value={signupPasswordConfirm}
                  onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                  type={showSignupPasswordConfirm ? "text" : "password"}
                  style={{ marginTop: "50px", margin: "10px" }}
                  addonAfter={
                    <Button
                      type="text"
                      icon={
                        showSignupPasswordConfirm ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() =>
                        setShowSignupPasswordConfirm(!showSignupPasswordConfirm)
                      }
                    />
                  }
                />
                <label style={{ marginTop: "40px", marginRight: "230px" }}>
                  Email :
                </label>
                <Input
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={{ marginTop: "50px", margin: "10px" }}
                />
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "20px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </Content>
      <Footer>
        <p>Triton industries©</p>
        <p>contact : talha.asgher222@gmail.com</p>
      </Footer>
    </Layout>
  );
}
