let calculatorCounter = 0;


class Calculator {

    constructor(container, calculatorData = null) {

        this.container = container;
        this.container.draggable = false;
        
        if (
            calculatorData !== null &&
            calculatorData.id !== undefined
        ) {
            this.id = calculatorData.id;
        
            if (this.id > calculatorCounter) {
                calculatorCounter = this.id;
            }
        
        } else {
        
            calculatorCounter++;
            this.id = calculatorCounter;
        }
        
        this.container.dataset.calculatorId =
            this.id;
        
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

            // Drag button//
            this.dragButton =
                container.querySelector(
                    '.drag-calculator-button'
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
                // IMPORTANT:
            // Give radio buttons unique names FIRST
                this.setupRadioButtons();

                
            if (calculatorData !== null) {

                this.firstNumber.value =
                    calculatorData.firstNumber;
            
                this.secondNumber.value =
                    calculatorData.secondNumber;

                    if (calculatorData.operator !== null) {

                        const savedOperator =
                            this.container.querySelector(
                                `.operator-radio[value="${calculatorData.operator}"]`
                            );
                    
                        savedOperator.checked = true;
                    }
                    this.resultField.textContent =
                    calculatorData.result;
                    if (calculatorData.minimized) {

                        this.container.classList.add(
                            'minimized'
                        );
                    
                        this.minimizeCalculatorButton.textContent =
                            '+';
                    
                        this.minimizeCalculatorButton.setAttribute(
                            'aria-label',
                            'Restore calculator'
                        );
                    
                        this.minimizedResult.textContent =
                            this.setupMinimizedResult();
                    
                    
            }
            }

          

        this.setupCalculator();
        this.addEventListeners();
       
    }

    setupMinimizedResult() {

        let firstNumberValue =
            this.firstNumber.value;
    
        let secondNumberValue =
            this.secondNumber.value;
    
        const selectedOperator =
            this.container.querySelector(
                '.operator-radio:checked'
            );
    
        let operator =
            selectedOperator
                ? selectedOperator.value
                : '';
    
        let result =
            this.resultField.textContent;
    
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
    
                let resultText =
                    this.setupMinimizedResult();
    
                this.minimizedResult.textContent =
                    resultText;
            }
        );
    
    
        this.calculateButton.addEventListener(
            'click',
            () => {
    
                this.calculate();
                saveCalculators();
            }
        );
    
    
        // Drag event listener
        this.dragButton.addEventListener(
            'mousedown',
            () => {
    
                this.container.draggable = true;
            }
        );
    
    
        this.container.addEventListener(
            'dragstart',
            () => {
    
                draggedCalculator =
                    this.container;
            }
        );
    
    
        this.container.addEventListener(
            'dragend',
            () => {
    
                this.container.draggable = false;
    
                saveCalculators();
    
                draggedCalculator = null;
            }
        );
    
    
        this.clearButton.addEventListener(
            'click',
            () => {
    
                this.clear();
                saveCalculators();
            }
        );
    
    
        this.removeCalculatorButton.addEventListener(
            'click',
            () => {
    
                this.removeCalculator();
                saveCalculators();
            }
        );
    
    
        this.minimizeCalculatorButton.addEventListener(
            'click',
            () => {
    
                this.minimizeCalculator();
                saveCalculators();
            }
        );
    }
}


/* =========================================
   CREATE NEW CALCULATOR
   ========================================= */

   function createCalculator(calculatorData = null) {

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
        newCalculatorElement,
        calculatorData
    );
}


/* =========================================
   START FIRST CALCULATOR
   ========================================= */

   loadCalculators();


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
        saveCalculators();
    }
);
//Drag and drop calculator//
let draggedCalculator = null;
const calculatorList =
    document.querySelector(
        '.calculator-list'
    );

    calculatorList.addEventListener(
        'dragover',
        (event) => {
            event.preventDefault();
    
            const elementUnderMouse =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );
    
                const calculatorUnderMouse =
                  elementUnderMouse.closest(
                    '.calculator'
                );
    
                if (
                    calculatorUnderMouse === null ||
                    calculatorUnderMouse === draggedCalculator
                ) {
                    return;
                }

                const rectangle =
                calculatorUnderMouse.getBoundingClientRect();

                const middleX =
                rectangle.left +
                rectangle.width / 2;


                if (event.clientX < middleX) {

                    calculatorList.insertBefore(
                        draggedCalculator,
                        calculatorUnderMouse
                    );
                } else {
                    calculatorList.insertBefore(
                        draggedCalculator,
                        calculatorUnderMouse.nextSibling
                    );
                }
        }
    );

    calculatorList.addEventListener(
        'drop',
        () => {
    
            saveCalculators();
        }
    );


    //local storage//
    function saveCalculators() {

        const calculatorElements =
            document.querySelectorAll(
                '.calculator-list .calculator'
            );
    
        const calculatorsData = [];
    
        calculatorElements.forEach((calculator) => {
    
            const firstNumber =
                calculator.querySelector(
                    '.first-number'
                ).value;
    
            const secondNumber =
                calculator.querySelector(
                    '.second-number'
                ).value;
    
            const selectedOperator =
                calculator.querySelector(
                    '.operator-radio:checked'
                );
    
            const operator =
                selectedOperator
                    ? selectedOperator.value
                    : null;
    
            const result =
                calculator.querySelector(
                    '.result'
                ).textContent;
    
            const minimized =
                calculator.classList.contains(
                    'minimized'
                );
               
                const id = calculator.dataset.calculatorId;
    
            calculatorsData.push({
                id: Number(id),
                firstNumber: firstNumber,
                secondNumber: secondNumber,
                operator: operator,
                result: result,
                minimized: minimized
            });
        });
    
        const calculatorsJSON =
        JSON.stringify(calculatorsData);

        localStorage.setItem(
            'calculators',
            calculatorsJSON
        );


    }

    function loadCalculators() {

        const calculatorsJSON =
            localStorage.getItem(
                'calculators'
            );
    
        // No saved data
        if (calculatorsJSON === null) {
            createCalculator();
            return;
        }
    
        const calculatorsData =
            JSON.parse(calculatorsJSON);
    
        // Saved array is empty
        if (calculatorsData.length === 0) {
            createCalculator();
            return;
        }
    
        // Create calculators from saved data
        calculatorsData.forEach(
            (calculatorData) => {
    
                createCalculator(
                    calculatorData
                );
    
            }
        );
    }