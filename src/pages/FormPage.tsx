import { validationErrors, success } from "../constants/messages"; 
import { patterns } from "../constants/patterns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInput from "../components/TextInput";
import Form from "../components/Form";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';

const FormPage = () => {

  const onSubmit = (data: FormData) => {
    console.log(Object.fromEntries(data.entries()));
    toast.success(success.formSubmitted, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <Form onSubmit = {onSubmit}>
      <div className="required mb-2">
        <h3 className="mb-3">Form Validations</h3>
        <div className="row mb-3">
          <div className="col-md-3">
            <TextInput label="First Name" id="firstName" name="firstName" required 
              pattern={patterns.namePattern} errorText= {validationErrors.nameError}/>
          </div>
          <div className="col-md-3">
            <TextInput label="Last Name" id="lastname" name="lastname" required 
              pattern={patterns.namePattern} errorText= {validationErrors.nameError}/>
          </div>
          <div className="col-md-3">
            <TextInput label="Email" id="email" type="email" name="email" required autoComplete="email"
              pattern= {patterns.emailPattern} errorText= {validationErrors.emailError}/>
          </div>
          <div className="col-md-3">
            <TextInput label="Password" id="password" type="password" name="password" required autoComplete="new-password"
              pattern= {patterns.passwordPattern} errorText= {validationErrors.passwordError}/>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">
            <TextInput
              label="Phone No." id="phoneNumber" name="phoneNumber" type="tel"
            />
          </div>
          <div className="col-md-3">
            <TextInput label="Date of Birth" id="dateOfBirth" name="dateOfBirth" 
              type="date"/>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-3">
            <TextInput label="Street" id="street" name="street" />
          </div>
          <div className="col-md-3">
            <TextInput label="Town" id="town" name="town" />
          </div>
          <div className="col-md-3">
            <TextInput label="City" id="city" name="city" />
          </div>
          <div className="col-md-3">
            <TextInput label="Zipcode" id="zipcode" name="zipcode" />
          </div>
        </div>
        <div className="text-center">
          <button className="mt-3 btn btn-primary">Submit</button>
        </div>
      </div>
      <ToastContainer />
    </Form>
  );
};
export default FormPage;