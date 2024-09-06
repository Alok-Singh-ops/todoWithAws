import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const login = async () => {
    try {
      const response = await axios.post("http://localhost:8080/user/signIn", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      const decoded = jwtDecode(response.data.token) as {
        email: string;
        profilePhoto: string;
      };
      localStorage.setItem("email", decoded.email);
      localStorage.setItem("profilePhoto", decoded.profilePhoto);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    login();
  };

  return (
    <div>
      <input type="text" placeholder="Email" onChange={handleEmailChange} />
      <input
        type="password"
        placeholder="Password"
        onChange={handlePasswordChange}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
};

export default Login;
