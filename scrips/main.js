var firstNumber = document.getElementById('input-first-number-field');
var secondNumber = document.getElementById('input-second-number-field');

var calculateButton = document.getElementById('calculate-button');

var resultField = document.getElementById('result');

var clearButton = document.getElementById('clear-button');

var multipleButton = document.getElementById('operation-multiply');
var divideButton = document.getElementById('operation-divide');
var addButton = document.getElementById('operation-add');
var subtractButton = document.getElementById('operation-subtract');



function zeroDivision() {

    if (
        (Number(firstNumber.value) === 0 ||
         Number(secondNumber.value) === 0) &&
        divideButton.checked
    ) {
        resultField.textContent = 'Error';
       return true
    }else{

        return false;
    }
}

function checkEmptyFields() {
    if(firstNumber.value === '' || secondNumber.value === '') {
        resultField.textContent = 'Fill in all fields before calculating';
        return true;
    }else{
        return false;
    }
}





/* Calculate button */
calculateButton.onclick = function() {
    let firstNumberValue = Number(firstNumber.value);
    let secondNumberValue = Number(secondNumber.value);

    let isEmptyFields = checkEmptyFields();
    if(isEmptyFields) {
     return;
    }

   let isZeroDivision = zeroDivision();
   if(isZeroDivision) {
    return;
   }

    
    let result = 0;
    if(multipleButton.checked) {
         result = firstNumberValue * secondNumberValue;
    } else if(divideButton.checked) {
         result = firstNumberValue / secondNumberValue;
    } else if(addButton.checked) {
         result = firstNumberValue + secondNumberValue;
    } else if(subtractButton.checked) {
         result = firstNumberValue - secondNumberValue;
    }
    resultField.textContent = result;

}

/* Clear button */
clearButton.onclick = function() {
    resultField.textContent = '—';
}

/* verify 0 in division*/

firstNumber.oninput = function() {
    if(secondNumber.value === '0' || firstNumber.value === '0' && divideButton.checked) {
        resultField.textContent = 'Error';
        
    }
}
