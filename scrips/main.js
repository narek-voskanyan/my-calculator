class Calculator {
    constructor(){
        this.firstNumber = document.getElementById('input-first-number-field');
        this.secondNumber = document.getElementById('input-second-number-field');
        this.calculateButton = document.getElementById('calculate-button');
        this.resultField = document.getElementById('result');
        this.clearButton = document.getElementById('clear-button');
        this.multipleButton = document.getElementById('operation-multiply');
        this.divideButton = document.getElementById('operation-divide');
        this.addButton = document.getElementById('operation-add');
        this.subtractButton = document.getElementById('operation-subtract');
    }

    checkEmptyFields() {
        if(this.firstNumber.value === '' || this.secondNumber.value === '') {
            this.resultField.textContent = 'Fill in all fields before calculating';
            return true;
        }else{
            return false;
        }
    }
    isOperationSelected() {
        const selectedOperation = document.querySelector('input[name="operation"]:checked') !== null;
        if(!selectedOperation) {
            this.resultField.textContent = 'Please select an operation';
            return true;
        }else{
            return false;
        }
    }
    
/* Calculate button */
    calculate() {
        let firstNumberValue = Number(this.firstNumber.value);
        let secondNumberValue = Number(this.secondNumber.value);
        let isEmptyFields = this.checkEmptyFields();
        if(isEmptyFields) {
            return;
        }
        let isOperationSelected = this.isOperationSelected();
        if(isOperationSelected) {
            return;
        }
        let isZeroDivision = this.zeroDivision();
        if(isZeroDivision) {
            return;
        }
        let result = 0;
        if(this.multipleButton.checked) {
            result = firstNumberValue * secondNumberValue;
        } else if(this.divideButton.checked) {
            result = firstNumberValue / secondNumberValue;
        } else if(this.addButton.checked) {
            result = firstNumberValue + secondNumberValue;
        } else if(this.subtractButton.checked) {
            result = firstNumberValue - secondNumberValue;
        }
    

    this.resultField.textContent = result;
}

    /* Clear button */
    clear() {
        this.resultField.textContent = '—';
        this.firstNumber.value = "";
        this.secondNumber.value = "";
    }

    zeroDivision() {
        if(this.secondNumber.value === '0' && this.divideButton.checked) {
            this.resultField.textContent = 'Error';
            return true;
        }else{
            return false;
        }
    }
}


const calculator = new Calculator();

calculator.calculateButton.addEventListener("click", function () {
    calculator.calculate();
});

calculator.clearButton.addEventListener('click', function () {
    calculator.clear();
});

