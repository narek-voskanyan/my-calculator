let calculatorCounter = 0;


class Calculator {

    constructor(container, calculatorData = null) {

        this.container = container;

        this.container.calculatorInstance =
            this;
        
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
        this.createControlPanelRow();
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

    updateControlPanelResult() {

        this.controlResult.textContent =
            `Result: ${this.resultField.textContent}`;
    }


    setupCalculator() {

        this.calculatorTitle.textContent =
            `Calculator ${this.id}`;
    }

    createControlPanelRow() {

        const controlList =
            document.querySelector(
                '.calculator-control-list'
            );
    
    
        // Find empty message
        const emptyMessage =
            controlList.querySelector(
                '.control-panel-empty'
            );
    
    
        // Remove empty message if calculator exists
        if (emptyMessage !== null) {
    
            emptyMessage.remove();
        }
    
    
        // Create control row
        const controlRow =
            document.createElement('div');
    
        controlRow.classList.add(
            'calculator-control-row'
        );
    
        controlRow.dataset.calculatorId =
            this.id;
    
    
        // Row is NOT draggable by default
        controlRow.draggable =
            false;
    
    
        // Create drag button
        const dragControlButton =
            document.createElement('button');
    
        dragControlButton.classList.add(
            'calculator-control-drag'
        );
    
        dragControlButton.type =
            'button';
    
        dragControlButton.textContent =
            '⠿';
    
        dragControlButton.setAttribute(
            'aria-label',
            'Drag calculator'
        );
    
    
        // Enable dragging only from drag button
        dragControlButton.addEventListener(
            'mousedown',
            () => {
    
                controlRow.draggable =
                    true;
            }
        );
    
    
        // Disable dragging when drag finishes
        controlRow.addEventListener(
            'dragend',
            () => {
    
                controlRow.draggable =
                    false;
    
                draggedControlRow =
                    null;
            }
        );
    
    
        // Create calculator title
        const controlTitle =
            document.createElement('span');
    
        controlTitle.classList.add(
            'calculator-control-title'
        );
    
        controlTitle.textContent =
            `Calculator ${this.id}`;
    
    
        // Create result text
        this.controlResult =
            document.createElement('span');
    
        this.controlResult.classList.add(
            'calculator-control-result'
        );
    
    
        // Synchronize result with calculator
        this.updateControlPanelResult();
    
    
        // Create Collapse / Expand button
        const minimizeControlButton =
            document.createElement('button');
    
        minimizeControlButton.classList.add(
            'calculator-control-minimize'
        );
    
        minimizeControlButton.type =
            'button';
    
    
        // Check current calculator state
        const isMinimized =
            this.container.classList.contains(
                'minimized'
            );
    
        minimizeControlButton.textContent =
            isMinimized
                ? 'Expand'
                : 'Collapse';
    
    
        // Collapse / Expand from Control Panel
        minimizeControlButton.addEventListener(
            'click',
            () => {
    
                this.minimizeCalculator();
                saveCalculators();
            }
        );
    
    
        // Create remove button
        const removeControlButton =
            document.createElement('button');
    
        removeControlButton.classList.add(
            'calculator-control-remove'
        );
    
        removeControlButton.type =
            'button';
    
        removeControlButton.textContent =
            '×';
    
    
        // Remove calculator
        removeControlButton.addEventListener(
            'click',
            () => {
    
                this.removeCalculator();
                saveCalculators();
            }
        );
    
    
        // Add elements to Control Panel row
        controlRow.appendChild(
            dragControlButton
        );
    
        controlRow.appendChild(
            controlTitle
        );
    
        controlRow.appendChild(
            this.controlResult
        );
    
        controlRow.appendChild(
            minimizeControlButton
        );
    
        controlRow.appendChild(
            removeControlButton
        );
    
    
        // Add completed row to Control Panel
        controlList.appendChild(
            controlRow
        );
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
        
            this.updateControlPanelResult();
            return;
        }


        const isOperationSelected =
            this.isOperationSelected();

        if (isOperationSelected) {
            this.updateControlPanelResult();
            return;
        }


        const isZeroDivision =
        this.zeroDivision();
    
    if (isZeroDivision) {
    
        this.updateControlPanelResult();
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
      
            this.updateControlPanelResult();
    }


    clear() {

        this.resultField.textContent =
        '—';
        this.updateControlPanelResult();


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

        // Remove calculator card
        this.container.remove();
    
    
        // Find Control Panel list
        const controlList =
            document.querySelector(
                '.calculator-control-list'
            );
    
    
        // Find corresponding Control Panel row
        const controlRow =
            controlList.querySelector(
                `.calculator-control-row[data-calculator-id="${this.id}"]`
            );
    
    
        // Remove Control Panel row
        if (controlRow !== null) {
            controlRow.remove();
        }
    
    
        // Check if any calculator rows are left
        const remainingRows =
            controlList.querySelectorAll(
                '.calculator-control-row'
            );
    
    
        // If there are no calculators, show empty message
        if (remainingRows.length === 0) {
    
            const emptyMessage =
                document.createElement('p');
    
            emptyMessage.classList.add(
                'control-panel-empty'
            );
    
            emptyMessage.textContent =
                'The list is empty.';
    
            controlList.appendChild(
                emptyMessage
            );
        }
    }


    setMinimized(minimized) {

        // Set calculator state
        this.container.classList.toggle(
            'minimized',
            minimized
        );
    
    
        // Update calculator header button
        this.minimizeCalculatorButton.textContent =
            minimized
                ? '+'
                : '−';
    
        this.minimizeCalculatorButton.setAttribute(
            'aria-label',
            minimized
                ? 'Restore calculator'
                : 'Minimize calculator'
        );
    
    
        // Update minimized result
        if (minimized) {
    
            this.minimizedResult.textContent =
                this.setupMinimizedResult();
        }
    
    
        // Find this calculator's Control Panel row
        const controlRow =
            document.querySelector(
                `.calculator-control-row[data-calculator-id="${this.id}"]`
            );
    
    
        if (controlRow !== null) {
    
            const controlButton =
                controlRow.querySelector(
                    '.calculator-control-minimize'
                );
    
    
            // Update Control Panel button
            if (controlButton !== null) {
    
                controlButton.textContent =
                    minimized
                        ? 'Expand'
                        : 'Collapse';
            }
        }
    }
    
    
    minimizeCalculator() {
    
        const isMinimized =
            this.container.classList.contains(
                'minimized'
            );
    
        this.setMinimized(
            !isMinimized
        );
    }

    addEventListeners() {

   
        // Calculate
        this.calculateButton.addEventListener(
            'click',
            () => {
    
                this.calculate();
                saveCalculators();
            }
        );
    
    
        // Enable dragging only from drag button
        this.dragButton.addEventListener(
            'mousedown',
            () => {
    
                this.container.draggable = true;
            }
        );
    
    
        // Start dragging calculator
        this.container.addEventListener(
            'dragstart',
            () => {
    
                draggedCalculator =
                    this.container;
            }
        );
    
    
        // Finish dragging calculator
        this.container.addEventListener(
            'dragend',
            () => {
    
                this.container.draggable = false;
    
                saveCalculators();
    
                draggedCalculator = null;
            }
        );
    
    
        // Clear calculator
        this.clearButton.addEventListener(
            'click',
            () => {
    
                this.clear();
                saveCalculators();
            }
        );
    
    
        // Remove calculator using calculator X
        this.removeCalculatorButton.addEventListener(
            'click',
            () => {
    
                this.removeCalculator();
                saveCalculators();
            }
        );
    
    
        // Minimize calculator
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
const collapseAllButton =
    document.querySelector(
        '.collapse-all-button'
    );

const expandAllButton =
    document.querySelector(
        '.expand-all-button'
    );

    // Collapse all calculators 
    collapseAllButton.addEventListener(
        'click',
        () => {
    
            setAllCalculatorsMinimized(
                true
            );
        }
    );
    
    // Expand all calculators 
    expandAllButton.addEventListener(
        'click',
        () => {
    
            setAllCalculatorsMinimized(
                false
            );
        }
    ); 

// Add calculator button//
addCalculatorButton.addEventListener(
    'click',
    () => {

        createCalculator();
        saveCalculators();
    }
);
// =========================================
// DRAG AND DROP
// =========================================

let draggedCalculator = null;
let draggedControlRow = null;


// Calculator list
const calculatorList =
    document.querySelector(
        '.calculator-list'
    );


// Control Panel list
const controlList =
    document.querySelector(
        '.calculator-control-list'
    );


// =========================================
// DRAG CALCULATOR CARDS
// =========================================

calculatorList.addEventListener(
    'dragover',
    (event) => {

        event.preventDefault();

        if (draggedCalculator === null) {
            return;
        }

        const elementUnderMouse =
            document.elementFromPoint(
                event.clientX,
                event.clientY
            );

        if (elementUnderMouse === null) {
            return;
        }

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
            calculatorUnderMouse
                .getBoundingClientRect();

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

        syncControlPanelOrder();
        saveCalculators();
    }
);


// =========================================
// DRAG CONTROL PANEL ROWS
// =========================================

controlList.addEventListener(
    'dragstart',
    (event) => {

        draggedControlRow =
            event.target.closest(
                '.calculator-control-row'
            );
    }
);


controlList.addEventListener(
    'dragover',
    (event) => {

        event.preventDefault();

        if (draggedControlRow === null) {
            return;
        }

        const controlRowUnderMouse =
            event.target.closest(
                '.calculator-control-row'
            );

        if (
            controlRowUnderMouse === null ||
            controlRowUnderMouse === draggedControlRow
        ) {
            return;
        }

        const rectangle =
            controlRowUnderMouse
                .getBoundingClientRect();

        const middleY =
            rectangle.top +
            rectangle.height / 2;

        if (event.clientY < middleY) {

            controlList.insertBefore(
                draggedControlRow,
                controlRowUnderMouse
            );

        } else {

            controlList.insertBefore(
                draggedControlRow,
                controlRowUnderMouse.nextSibling
            );
        }
    }
);


controlList.addEventListener(
    'drop',
    () => {

        syncCalculatorOrder();
        saveCalculators();
    }
);


controlList.addEventListener(
    'dragend',
    () => {

        draggedControlRow =
            null;
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
    
    
        // First visit: no LocalStorage yet
        if (calculatorsJSON === null) {
    
            createCalculator();
            return;
        }
    
    
        const calculatorsData =
            JSON.parse(
                calculatorsJSON
            );
    
    
        // Saved empty array means:
        // user intentionally has 0 calculators
        if (calculatorsData.length === 0) {
            return;
        }
    
    
        // Restore saved calculators
        calculatorsData.forEach(
            (calculatorData) => {
    
                createCalculator(
                    calculatorData
                );
    
            }
        );
    }

    function setAllCalculatorsMinimized(minimized) {

        const calculators =
            document.querySelectorAll(
                '.calculator'
            );
    
    
        calculators.forEach((calculator) => {
    
            calculator.calculatorInstance.setMinimized(
                minimized
            );
    
        });
    
    
        saveCalculators();
    }

    function syncControlPanelOrder() {

        const calculators =
            document.querySelectorAll(
                '.calculator-list .calculator'
            );
    
        const controlList =
            document.querySelector(
                '.calculator-control-list'
            );
    
        calculators.forEach((calculator) => {
    
            const calculatorId =
                calculator.dataset.calculatorId;
    
            const controlRow =
                controlList.querySelector(
                    `.calculator-control-row[data-calculator-id="${calculatorId}"]`
                );
    
            if (controlRow !== null) {
    
                controlList.appendChild(
                    controlRow
                );
            }
        });
    }

    function syncCalculatorOrder() {

        const controlRows =
            document.querySelectorAll(
                '.calculator-control-row'
            );
    
        const calculatorList =
            document.querySelector(
                '.calculator-list'
            );
    
        controlRows.forEach((controlRow) => {
    
            const calculatorId =
                controlRow.dataset.calculatorId;
    
            const calculator =
                calculatorList.querySelector(
                    `.calculator[data-calculator-id="${calculatorId}"]`
                );
    
            if (calculator !== null) {
    
                calculatorList.appendChild(
                    calculator
                );
            }
        });
    }