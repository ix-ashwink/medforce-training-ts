import React, { useState } from "react";
import { User } from "../constants/entities";
import { validationErrors, success } from "../constants/messages"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormPage = () => {

  const [user, setUser] = useState<User>({firstName:"",lastName: "",email:"",password:"",phoneNumber:"", dateOfBirth:"",
  street:"",town:"",city:"",zipcode:"", bio:""});

  const handleChange = (e:any) => {
    const {name, value} = e.target;
    setUser({...user, [name]: value}) 
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

    if (!emailPattern.test(user.email)) {
      toast.error(validationErrors.emailError, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (!passwordPattern.test(user.password)) {
      toast.error(validationErrors.passwordError, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    toast.success(success.formSubmitted, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form form-group required mt-4 mb-4">
        <h3 className="mb-2">Form Validations</h3>
        <div className="row mb-1">
          <div className="col-md-6">
            <label className="">First Name</label>
            <input
              className="form-control"
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Last Name</label>
            <input
              className="form-control"
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-md-6">
            <label className="control-label">Email</label>
            <input
              className="form-control"
              type="text"
              name="email"
              placeholder="Enter your email..."
              onChange={handleChange}
            />
          </div> 
          <div className="col-md-6">
            <label className="control-label">Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Enter a strong password..."
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-md-6">
            <label>Phone No.</label>
            <input
              className="form-control"
              type="text"
              name="phoneNumber"
              placeholder="Enter Phone No."
              onChange={handleChange}
            />
          </div> 
          <div className="col-md-6">
            <label>Date of Birth</label>
            <input
              className="form-control"
              type="date"
              name="dateOfBirth"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-md-6">
            <label>Street</label>
            <input
              className="form-control"
              type="text"
              name="street"
              placeholder="Enter Street"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Town</label>
            <input
              className="form-control"
              type="text"
              name="town"
              placeholder="Enter Town"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-md-6">
            <label className="">City</label>
            <input
              className="form-control"
              type="text"
              name="city"
              placeholder="Enter City"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label>Zipcode</label>
            <input
              className="form-control"
              type="text"
              name="zipcode"
              placeholder="Enter Zipcode"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-1">
          <div>
            <label>Bio</label>
            <textarea
              className="form-control"
              name="bio"
              placeholder="Enter Bio"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="mt-3 btn btn-primary"
            disabled={user.email === "" || user.password === ""}>
            Submit
          </button>
        </div>
      </div>
    <ToastContainer />
    </form >
  );
};
export default FormPage;