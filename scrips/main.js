let calculatorCounter = 0;


class Calculator {

    constructor(container) {

        calculatorCounter++;

        this.id = calculatorCounter;
        this.container = container;
        
        // Minimized result//
        this.minimizedResult =
            container.querySelector(
                '.calculator-minimized-result'
            );

        // Minimize button//
        this.minimizeButton =
            container.querySelector(
                '.minimize-calculator-button'
            );


        // Number inputs

        this.firstNumber =
            container.querySelector('.first-number');

        this.secondNumber =
            container.querySelector('.second-number');


        // Checkbox

        this.clearOperatorCheckbox =
            container.querySelector(
                '.clear-operator-checkbox'
            );


        // Main buttons

        this.calculateButton =
            container.querySelector(
                '.calculate-button'
            );

        this.clearButton =
            container.querySelector(
                '.clear-button'
            );


        // Result

        this.resultField =
            container.querySelector(
                '.result'
            );

            //Operator buttons//

        this.multipleButton =
            container.querySelector(
                '.operation-multiply'
            );

        this.divideButton =
            container.querySelector(
                '.operation-divide'
            );

        this.addButton =
            container.querySelector(
                '.operation-add'
            );

        this.subtractButton =
            container.querySelector(
                '.operation-subtract'
            );


        // Window controls

        this.removeCalculatorButton =
            container.querySelector(
                '.remove-calculator-button'
            );

        this.minimizeCalculatorButton =
            container.querySelector(
                '.minimize-calculator-button'
            );


        // Calculator title

        this.calculatorTitle =
            container.querySelector(
                '.calculator-window-title'
            );


        this.setupCalculator();
        this.setupRadioButtons();
        this.addEventListeners();
    }

    setupMinimizedResult() {
        let firstNumberValue = this.firstNumber.value
        let secondNumberValue = this.secondNumber.value
        let operator = this.container.querySelector('.operator-radio:checked').value;
        let result = this.resultField.textContent;
        return `${firstNumberValue} ${operator} ${secondNumberValue} = ${result}`;
    }


    setupCalculator() {

        this.calculatorTitle.textContent =
            `Calculator ${this.id}`;
    }


    setupRadioButtons() {

        const radioButtons =
            this.container.querySelectorAll(
                '.operator-radio'
            );

        radioButtons.forEach((radio) => {

            radio.name =
                `operation-${this.id}`;

            const operation =
                radio.value;

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

            label.setAttribute(
                'for',
                radio.id
            );

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


    zeroDivision() {

        if (
            Number(this.secondNumber.value) === 0 &&
            this.divideButton.checked
        ) {

            this.resultField.textContent =
                'Error';

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
                firstNumberValue *
                secondNumberValue;

        } else if (this.divideButton.checked) {

            result =
                firstNumberValue /
                secondNumberValue;

        } else if (this.addButton.checked) {

            result =
                firstNumberValue +
                secondNumberValue;

        } else if (this.subtractButton.checked) {

            result =
                firstNumberValue -
                secondNumberValue;

        }


        this.resultField.textContent =
            result;
    }


    clear() {

        this.resultField.textContent =
            '—';

        this.firstNumber.value =
            '';

        this.secondNumber.value =
            '';


        if (this.clearOperatorCheckbox.checked) {

            const selectedOperation =
                this.container.querySelector(
                    '.operator-radio:checked'
                );


            if (selectedOperation) {

                selectedOperation.checked =
                    false;
            }
        }
    }


    removeCalculator() {

        this.container.remove();
    }


    minimizeCalculator() {

        this.container.classList.toggle(
            'minimized'
        );


        const isMinimized =
            this.container.classList.contains(
                'minimized'
            );


        if (isMinimized) {

            this.minimizeCalculatorButton.textContent =
                '+';

            this.minimizeCalculatorButton.setAttribute(
                'aria-label',
                'Restore calculator'
            );

        } else {

            this.minimizeCalculatorButton.textContent =
                '−';

            this.minimizeCalculatorButton.setAttribute(
                'aria-label',
                'Minimize calculator'
            );

        }
    }


    addEventListeners() {
        this.minimizeButton.addEventListener(
            'click',
            () => {
               let resultText = this.setupMinimizedResult();
               this.minimizedResult.textContent = resultText;
            }
        );

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


        this.removeCalculatorButton.addEventListener(
            'click',
            () => {

                this.removeCalculator();

            }
        );


        this.minimizeCalculatorButton.addEventListener(
            'click',
            () => {

                this.minimizeCalculator();

            }
        );
    }
}


/* =========================================
   CREATE NEW CALCULATOR
   ========================================= */

   function createCalculator() {

    // Find calculator template
    const calculatorTemplate =
        document.querySelector(
            '#calculator-template'
        );


    // Find calculator inside template
    const calculatorBlueprint =
        calculatorTemplate.content.querySelector(
            '.calculator'
        );


    // Create a new calculator from template
    const newCalculatorElement =
        calculatorBlueprint.cloneNode(true);


    // Add calculator to page
    const calculatorList =
        document.querySelector(
            '.calculator-list'
        );

    calculatorList.appendChild(
        newCalculatorElement
    );


    // Give new calculator its own logic
    new Calculator(
        newCalculatorElement
    );
}


/* =========================================
   START FIRST CALCULATOR
   ========================================= */

   createCalculator();


/* =========================================
   GLOBAL ADD CALCULATOR BUTTON
   ========================================= */

const addCalculatorButton =
    document.querySelector(
        '.add-calculator-button'
    );


addCalculatorButton.addEventListener(
    'click',
    () => {

        createCalculator();

    }
);