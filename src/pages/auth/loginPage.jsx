import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { routePath } from "../../app/routes/routepath";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styled from "styled-components";
import backgroundImage from '../../app/assests/login6.jpg';
import { userLoginReq } from "../../api/authApi/loginReq";
import { addUserAction } from "../../app/redux/slice/auth/authslice.jsx";
import { fetchProfileListReq } from "../../api/profileApi/profile.js";

const LoginPage = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigatedFromLogout = location?.state?.navigatedFrom === "logout";
  const previousPath = localStorage.getItem("previousPath");

  const [loginErrMsg, setloginErrMsg] = useState("");
  const [loginLoading, setloginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setloginErrMsg("");
    setloginLoading(true);
    try {
      const res = await userLoginReq({
        userName: data?.username,
        password: data?.password,
      });
      addUserAction(res?.data, dispatch);

      const response = await fetchProfileListReq();
      const restaurantData = response?.data;
      localStorage.setItem("restaurantData", JSON.stringify(restaurantData));

      if (!navigatedFromLogout && !!previousPath) {
        navigation(previousPath);
        setloginLoading(false);
        return;
      }

      navigation(`${routePath.main}/${routePath.dashboard}`);
      setloginLoading(false);
    } catch (error) {
      setloginLoading(false);
      setloginErrMsg(error?.errorMsg || "Login failed. Please try again.");
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Logo>AVINYA & INDUS SPICES.</Logo>
        <FormHeader>Login to your account</FormHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>Username*</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              {...register("username", {
                required: "Username is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]{2,}$/i,
                  message: "Enter a valid username",
                },
              })}
            />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>Password*</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordWrapper>
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </InputGroup>

          <CheckboxGroup>
            <input type="checkbox" {...register("rememberMe")} />
            <span>Remember Me</span>
          </CheckboxGroup>

          {loginErrMsg && <ErrorText>{loginErrMsg}</ErrorText>}

          <SubmitButton type="submit" disabled={loginLoading}>
            {loginLoading ? "Logging in..." : "Log In"}
          </SubmitButton>
        </Form>
        {/* <ForgotPasswordLink href="#">Lost your password?</ForgotPasswordLink> */}
      </FormContainer>
    </PageContainer>
  );
};

export default LoginPage;

// Styled Components

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${backgroundImage}) no-repeat center center/cover;
  font-family: 'Poppins', sans-serif;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 32px;
  color: #c0392b;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 1px;
`;

const FormHeader = styled.h2`
  font-size: 18px;
  color: #444;
  font-weight: 300;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  font-size: 14px;
  color: #444;
  margin-bottom: 5px;
  display: inline-block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #f39c12;
    outline: none;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.span`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
`;

const ErrorText = styled.small`
  color: red;
  font-size: 12px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
`;

const SubmitButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ForgotPasswordLink = styled.a`
  font-size: 14px;
  color: #555;
  text-decoration: none;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`;
