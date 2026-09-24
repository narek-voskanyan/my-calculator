let calculatorCounter = 0;

class Calculator {

    constructor(container) {
        calculatorCounter++;

        this.id = calculatorCounter;
        this.container = container;

        this.firstNumber =
            container.querySelector('.first-number');

        this.secondNumber =
            container.querySelector('.second-number');

        this.clearOperatorCheckbox =
            container.querySelector('.clear-operator-checkbox');

        this.calculateButton =
            container.querySelector('.calculate-button');

        this.resultField =
            container.querySelector('.result');

        this.clearButton =
            container.querySelector('.clear-button');

        this.newCalculatorButton =
            container.querySelector('.new-calculator-button');

        this.multipleButton =
            container.querySelector('.operation-multiply');

        this.divideButton =
            container.querySelector('.operation-divide');

        this.addButton =
            container.querySelector('.operation-add');

        this.subtractButton =
            container.querySelector('.operation-subtract');

        this.removeCalculatorButton =
            container.querySelector('.remove-calculator-button');

        this.setupRadioButtons();
        this.addEventListeners();
    }


    setupRadioButtons() {
        const radioButtons =
            this.container.querySelectorAll('.operator-radio');

        radioButtons.forEach((radio) => {
            radio.name = `operation-${this.id}`;

            const operation = radio.value;

            let operationName;

            if (operation === '+') {
                operationName = 'add';
            } else if (operation === '-') {
                operationName = 'subtract';
            } else if (operation === '*') {
                operationName = 'multiply';
            } else if (operation === '/') {
                operationName = 'divide';
            }

            radio.id =
                `operation-${operationName}-${this.id}`;

            const label =
                radio.nextElementSibling;

            label.setAttribute('for', radio.id);
        });
    }


    checkEmptyFields() {
        if (
            this.firstNumber.value === '' ||
            this.secondNumber.value === ''
        ) {
            this.resultField.textContent =
                'Fill in all fields before calculating';

            return true;
        } else {
            return false;
        }
    }


    isOperationSelected() {
        const selectedOperation =
            this.container.querySelector(
                '.operator-radio:checked'
            ) !== null;

        if (!selectedOperation) {
            this.resultField.textContent =
                'Please select an operation';

            return true;
        } else {
            return false;
        }
    }


    calculate() {
        const firstNumberValue =
            Number(this.firstNumber.value);

        const secondNumberValue =
            Number(this.secondNumber.value);

        const isEmptyFields =
            this.checkEmptyFields();

        if (isEmptyFields) {
            return;
        }

        const isOperationSelected =
            this.isOperationSelected();

        if (isOperationSelected) {
            return;
        }

        const isZeroDivision =
            this.zeroDivision();

        if (isZeroDivision) {
            return;
        }

        let result = 0;

        if (this.multipleButton.checked) {
            result =
                firstNumberValue * secondNumberValue;

        } else if (this.divideButton.checked) {
            result =
                firstNumberValue / secondNumberValue;

        } else if (this.addButton.checked) {
            result =
                firstNumberValue + secondNumberValue;

        } else if (this.subtractButton.checked) {
            result =
                firstNumberValue - secondNumberValue;
        }

        this.resultField.textContent = result;
    }


    clear() {
        this.resultField.textContent = '—';

        this.firstNumber.value = '';
        this.secondNumber.value = '';

        if (this.clearOperatorCheckbox.checked) {
            const selectedOperation =
                this.container.querySelector(
                    '.operator-radio:checked'
                );

            if (selectedOperation) {
                selectedOperation.checked = false;
            }
        }
    }


    zeroDivision() {
        if (
            this.secondNumber.value === '0' &&
            this.divideButton.checked
        ) {
            this.resultField.textContent = 'Error';

            return true;
        } else {
            return false;
        }
    }


    addEventListeners() {
        this.calculateButton.addEventListener(
            'click',
            () => {
                this.calculate();
            }
        );

        this.clearButton.addEventListener(
            'click',
            () => {
                this.clear();
            }
        );

        this.newCalculatorButton.addEventListener(
            'click',
            () => {
                this.generateCalculator();
            }
        );

        if (this.removeCalculatorButton) {
            this.removeCalculatorButton.addEventListener(
                'click',
                () => {
                    this.removeCalculator();
                }
            );
        }
    }


    removeCalculator() {
        this.container.remove();
    }


    generateCalculator() {
        const newCalculatorElement =
            this.container.cloneNode(true);


        // Reset number fields

        const firstNumber =
            newCalculatorElement.querySelector(
                '.first-number'
            );

        const secondNumber =
            newCalculatorElement.querySelector(
                '.second-number'
            );

        firstNumber.value = '';
        secondNumber.value = '';


        // Reset result

        const result =
            newCalculatorElement.querySelector(
                '.result'
            );

        result.textContent = '—';


        // Reset checkbox

        const clearOperatorCheckbox =
            newCalculatorElement.querySelector(
                '.clear-operator-checkbox'
            );

        clearOperatorCheckbox.checked = false;


        // Reset radio buttons

        const radioButtons =
            newCalculatorElement.querySelectorAll(
                '.operator-radio'
            );

        radioButtons.forEach((radio) => {
            radio.checked = false;
        });


        // Find action buttons

        const actionButtons =
            newCalculatorElement.querySelector(
                '.action-buttons'
            );


        // Check if Remove button already exists

        const existingRemoveButton =
            newCalculatorElement.querySelector(
                '.remove-calculator-button'
            );


        // Create Remove button only if it doesn't exist

        if (!existingRemoveButton) {
            const removeButton =
                document.createElement('button');

            removeButton.textContent = 'Remove';

            removeButton.classList.add(
                'remove-calculator-button'
            );

            removeButton.type = 'button';

            actionButtons.appendChild(removeButton);
        }


        // Add new calculator to page

        const calculatorList =
            document.querySelector(
                '.calculator-list'
            );

        calculatorList.appendChild(
            newCalculatorElement
        );


        // Create Calculator object for the new calculator

        new Calculator(newCalculatorElement);
    }
}


// Start first calculator

const firstCalculatorContainer =
    document.querySelector('.calculator');

const calculator =
    new Calculator(firstCalculatorContainer);