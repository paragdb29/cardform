import React, { useState, useRef } from 'react';
import moment from 'moment';
import './App.css';

const defaultFormValues = {
  cardHolderName: '',
  cardNumber: '',
  ccv: '',
  expirationDate: {mm:'',yy:''}
}

const defaultErrorValues = {
  cardHolderName: {isValid:true, error: ''},
  cardNumber:  {isValid:true, error: ''},
  cvv:  {isValid:true, error: ''},
  expirationDate:  {isValid:true, error: ''}
} 

const allowedKeys = [8,9,16,38,40];
const regexOnlyAlphabets = /^([a-zA-Z _-]+)$/;
const regexOnlyNumber = /^([0-9]+)$/;

const App = () => {
  const mainError = useRef(null);

  const [currentValues, updateValues] = useState(defaultFormValues);
  const [currentErrors, updateErrors] = useState(defaultErrorValues);

  const setValues = newValues => updateValues({...currentValues, ...newValues});

  const setErrors = newValues => updateErrors({...currentErrors, ...newValues});

  const clearString = val => {return val.replace(/\s+/g, '')};

  const isEmpty = val => clearString(val).length === 0 ;

  const validateCardHolderName = val => {
    let isValid = !isEmpty(val) && val.length > 5 &&  regexOnlyAlphabets.test(val);
    let error = isValid ? '': 'Invalid name';
    return { isValid, error };
  }
  const validateCardNumber = val => {
    let isValid = !isEmpty(val) && val.length === 16 &&  regexOnlyNumber.test(val);
    let error = isValid ? '': 'Invalid card number';
    return { isValid, error };    
  }
  const validateCvv = val => {
    let isValid = !isEmpty(val) && val.length === 3 &&  regexOnlyNumber.test(val);
    let error = isValid ? '': 'Invalid cvv number';
    return { isValid, error };        
  }

  const validateDate = val => {
    let now = moment();
    let enteredDate = moment(val.mm+"-01-"+val.yy, "MM-DD-YY");
    return moment(enteredDate).isBefore(now) || moment(enteredDate).isAfter(moment().add(10, 'y')); ;
  }

  const validateExpirationDate = val => {
    let isValid = !isEmpty(val.mm) && !isEmpty(val.yy)  && val.mm.length === 2 && val.yy.length === 2 &&  regexOnlyNumber.test(val.mm) &&  regexOnlyNumber.test(val.yy);
    if(isValid){
      isValid = !validateDate(val);
    }
    let error = isValid ? '': 'Invalid expiration date';
    return { isValid, error };     
  }

  let isFormValid = true;

  const handleSubmit = (event) => {
    const cardHolderName = validateCardHolderName(currentValues.cardHolderName);
    const cardNumber = validateCardNumber(currentValues.cardNumber);
    const cvv = validateCvv(currentValues.cvv);
    const expirationDate = validateExpirationDate(currentValues.expirationDate);
    setErrors({cardHolderName,cardNumber,cvv,expirationDate});
    if(cardHolderName.isValid && cardNumber.isValid && cvv.isValid && expirationDate.isValid){
      mainError.current.style.display = "none";
      console.log('Submitted data is: ', currentValues);
    } else {
      isFormValid = false;
      mainError.current.style.display = "block";
      mainError.current.focus();
    }
    event.preventDefault();
  }

  return (
    <div className="App">
      <h1>Welcome to DNB form Assignment</h1>
      <div ref={mainError} className="mainError"> Please enter valid data</div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="cardHolderName" className="fieldLabel">
            Card Holder Name
          </label>
          <span className="inputContainer">
            { !currentErrors.cardHolderName.isValid ? <span className="errormessage" id="cardHolderNameError">{currentErrors.cardHolderName.error}</span> : null }
            <input 
              id="cardHolderName"
              className="fieldInput"
              type="text"
              value={currentValues.cardHolderName}
              onChange={ ev => setValues({cardHolderName: ev.target.value})}
              required
              aria-required={true}
              aria-describedby="cardHolderNameError"
              aria-invalid={!currentErrors.cardHolderName.isValid}
            />
          </span>
        </div>
        <div className="field">
          <label htmlFor="cardNumber" className="fieldLabel">
            Card Number
          </label>
          <span className="inputContainer">
            { !currentErrors.cardNumber.isValid ? <span className="errormessage" id="cardNumberError">{currentErrors.cardNumber.error}</span> : null }
            <input 
              id="cardNumber"
              className="fieldInput"
              type="number"
              maxLength="16"
              pattern="[0-9]*"
              onKeyDown={ev => {
                console.log(ev.currentTarget.value.length);
                if((ev.currentTarget.value.length > 15 && allowedKeys.indexOf(ev.keyCode) === -1 && (ev.keyCode < 31  || ev.keyCode > 46)) || ev.keyCode === 69 )ev.preventDefault();
              }}
              value={currentValues.cardNumber}
              onChange={ ev => setValues({cardNumber: ev.target.value})}
              required
              aria-required={true}
              aria-describedby="cardNumberError"
              aria-invalid={!currentErrors.cardNumber.isValid}
            />
          </span>
        </div>
        <div className="field">
          <label htmlFor="cvv" className="fieldLabel">
            CVV
          </label>
          <span className="inputContainer">
            { !currentErrors.cvv.isValid ? <span className="errormessage" id="cvvError">{currentErrors.cvv.error}</span> : null }
            <input 
              id="cvv"
              className="fieldInput"
              type="number"
              maxLength="3"
              pattern="[0-9]*"
              onKeyDown={ev => {
                if((ev.currentTarget.value.length > 2 && allowedKeys.indexOf(ev.keyCode) === -1 && (ev.keyCode < 31  || ev.keyCode > 46)) || ev.keyCode === 69 )ev.preventDefault();
              }}
              value={currentValues.cvv}
              onChange={ ev => setValues({cvv: ev.target.value})}
              required
              aria-required={true}
              aria-describedby="cvvError"
              aria-invalid={!currentErrors.cvv.isValid}
            />
          </span>
        </div>
        <div className="field">
          <label id="expirationDate" className="fieldLabel">
            Expiration date
          </label>
          <span className="inputContainer">
            { !currentErrors.expirationDate.isValid? <span className="errormessage" id="expirationDateError">{currentErrors.expirationDate.error}</span> : null }
            <span className="fieldInput">
              <input 
              type="number"
              className="expirydateInput"
              placeholder="mm"
              maxLength="2"
              pattern="[0-9]*"
              onKeyDown={ev => {
                if((ev.currentTarget.value.length > 1 && allowedKeys.indexOf(ev.keyCode) === -1 && (ev.keyCode < 31  || ev.keyCode > 46)) || ev.keyCode === 69 )ev.preventDefault();
              }}
              value={currentValues.expirationDate.mm}
              onChange={ ev => {
                const expirationDate = {mm: ev.target.value,yy:currentValues.expirationDate.yy}
                setValues({expirationDate})
              }}
              required
              aria-required={true}
              aria-describedby="expirationDateError"
              aria-labelledby="expirationDate"
              aria-invalid={!currentErrors.expirationDate.isValid}
            />
            <span className="expirydateSlash">/</span>
            <input 
              type="number"
              className="expirydateInput"
              placeholder="yy"
              maxLength="2"
              pattern="[0-9]*"
              onKeyDown={ev => {
                if((ev.currentTarget.value.length > 1 && allowedKeys.indexOf(ev.keyCode) === -1 && (ev.keyCode < 31  || ev.keyCode > 46)) || ev.keyCode === 69 )ev.preventDefault();
              }}
              value={currentValues.expirationDate.yy}
              onChange={ ev => {
                const expirationDate = {yy: ev.target.value,mm:currentValues.expirationDate.mm}
                setValues({expirationDate})
              }}
              required
              aria-required={true}
              aria-describedby="expirationDateError"
              aria-labelledby="expirationDate"
              aria-invalid={!currentErrors.expirationDate.isValid}
            />
            </span>
          </span>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
