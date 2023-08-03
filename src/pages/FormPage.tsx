import React, { useState } from "react";

const FormPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

    if (!emailPattern.test(email)) {
      setPasswordError("Check entered email once again");
      alert(passwordError);
      return;
    }

    if (!passwordPattern.test(password)) {
      setPasswordError("Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol.");
      alert(passwordError);
      return;
    }
    // setPasswordError("");
    alert("The email address and password are " + email + " and " + password + " respectively.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form mt-5">
        <h3>Form Validations</h3>
        <div className="mt-3 mb-2">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            name="email"
            value={email}
            placeholder="Enter your email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={password}
            placeholder="Enter a strong password..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button 
            type="submit" 
            className="mt-3 btn btn-success" 
            disabled = {email === "" || password === ""}>
              Submit
          </button>
        </div>
      </div>
    </form >
  );
};

export default FormPage;