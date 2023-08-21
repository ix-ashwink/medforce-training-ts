import { validationErrors, success } from "../constants/messages"; 
import { patterns } from "../constants/patterns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInput from "../components/TextInput";
import Form from "../components/Form";
// import 'react-modern-calendar-datepicker/lib/DatePicker.css';
// import DatePicker, { DayValue, DayRange } from 'react-modern-calendar-datepicker';
import DatePicker, { DayValue, DayRange, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { useState } from "react";
import styles from "../style/datePicker.module.css";
import Label from "../components/Label";

const FormPage = () => {

  const [dateOfBirth, setDateOfBirth] = useState<DayValue>(null);
  const [dateRange, setDateRange] = useState<DayRange>({
    from: null, to: null
  });

  const formatInputValue = (date: DayValue) => {
    if (!date) return '';
    return `${date.month}-${date.day}-${date.year}`;
  };

  const onSubmit = (formData: FormData) => {

    const startDate = dateRange.from;
    const endDate = dateRange.to;

    const data = { ...Object.fromEntries(formData.entries()), 
      dateOfBirth: dateOfBirth, 
      startDate: startDate,
      endDate: endDate,
    };

    console.log("data", data);
    // console.log(Object.fromEntries(formData.entries()));

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
            <TextInput label="Email" id="email" 
              type="email"
              name="email" required
              // pattern= {patterns.emailPattern} 
              errorText= {validationErrors.emailError}/>
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
          {/* <div className="col-md-3">
            <TextInput label="Date of Birth" id="dateOfBirth" name="dateOfBirth" type="date"/>
          </div> */}
          <div className="col-md-3">
            <Label label="Date Of Birth"/>
            <DatePicker
              // inputName="dateOfBirth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              wrapperClassName={styles.dateWrapper}
              inputClassName={styles.input}
              inputPlaceholder="Select a day"
              calendarPopperPosition="bottom"
              // formatInputText = {formatInputValue()}
              minimumDate={utils("en").getToday()}
              shouldHighlightWeekends
            />
          </div>
          <div className="col-md-3">
            <Label label="Date Range"/>
            <DatePicker 
              // inputName="dateRange"
              value={dateRange} 
              onChange={setDateRange}
              wrapperClassName={styles.dateWrapper}
              inputClassName={styles.input}
              inputPlaceholder="Select a date range"
              calendarPopperPosition="bottom"
              shouldHighlightWeekends 
            />
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