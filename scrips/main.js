window.CalculatorApp = function(options) {

    var self = this;

    // =========================================
    // VARIABLES
    // =========================================

    this.initVars = function() {

        this.options = options;

        this.calculatorList =
            document.querySelector(
                options.calculatorList
            );

        this.controlList =
            document.querySelector(
                options.controlList
            );

        this.addCalculatorButton =
            document.querySelector(
                options.addButton
            );

        this.collapseAllButton =
            document.querySelector(
                options.collapseAllButton
            );

        this.expandAllButton =
            document.querySelector(
                options.expandAllButton
            );

        this.calculatorTemplate =
            document.querySelector(
                options.calculatorTemplate
            );

        this.calculatorCounter = 0;

        this.draggedCalculator = null;
        this.draggedControlRow = null;
    };


    // =========================================
    // CREATE CALCULATOR
    // =========================================

    this.createCalculator = function(calculatorData = null) {

        const calculatorBlueprint =
            this.calculatorTemplate.content.querySelector(
                '.calculator'
            );

        const newCalculatorElement =
            calculatorBlueprint.cloneNode(true);

        this.calculatorList.appendChild(
            newCalculatorElement
        );

        let calculatorId;

        if (
            calculatorData !== null &&
            calculatorData.id !== undefined
        ) {

            calculatorId = calculatorData.id;

            if (calculatorId > this.calculatorCounter) {
                this.calculatorCounter = calculatorId;
            }

        } else {

            this.calculatorCounter++;
            calculatorId = this.calculatorCounter;
        }

        new Calculator(
            newCalculatorElement,
            calculatorData,
            calculatorId,
            this
        );
    };


    // =========================================
    // LOAD CALCULATORS
    // =========================================

    this.loadCalculators = function() {

        const calculatorsJSON =
            localStorage.getItem(
                'calculators'
            );

        if (calculatorsJSON === null) {

            this.createCalculator();
            return;
        }

        const calculatorsData =
            JSON.parse(
                calculatorsJSON
            );

        if (calculatorsData.length === 0) {
            return;
        }

        calculatorsData.forEach(
            function(calculatorData) {

                self.createCalculator(
                    calculatorData
                );
            }
        );
    };


    // =========================================
    // SAVE CALCULATORS
    // =========================================

    this.saveCalculators = function() {

        const calculatorElements =
            this.calculatorList.querySelectorAll(
                '.calculator'
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

            const id =
                calculator.dataset.calculatorId;

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
            JSON.stringify(
                calculatorsData
            );

        localStorage.setItem(
            'calculators',
            calculatorsJSON
        );
    };


    // =========================================
    // MINIMIZE ALL
    // =========================================

    this.setAllCalculatorsMinimized = function(minimized) {

        const calculators =
            this.calculatorList.querySelectorAll(
                '.calculator'
            );

        calculators.forEach(function(calculator) {

            calculator.calculatorInstance.setMinimized(
                minimized
            );
        });

        this.saveCalculators();
    };


    // =========================================
    // SYNCHRONIZE ORDER
    // =========================================

    this.syncControlPanelOrder = function() {

        const calculators =
            this.calculatorList.querySelectorAll(
                '.calculator'
            );

        calculators.forEach((calculator) => {

            const calculatorId =
                calculator.dataset.calculatorId;

            const controlRow =
                this.controlList.querySelector(
                    `.calculator-control-row[data-calculator-id="${calculatorId}"]`
                );

            if (controlRow !== null) {

                this.controlList.appendChild(
                    controlRow
                );
            }
        });
    };


    this.syncCalculatorOrder = function() {

        const controlRows =
            this.controlList.querySelectorAll(
                '.calculator-control-row'
            );

        controlRows.forEach((controlRow) => {

            const calculatorId =
                controlRow.dataset.calculatorId;

            const calculator =
                this.calculatorList.querySelector(
                    `.calculator[data-calculator-id="${calculatorId}"]`
                );

            if (calculator !== null) {

                this.calculatorList.appendChild(
                    calculator
                );
            }
        });
    };


    // =========================================
    // BROWSER DRAG AND DROP API
    // =========================================

    this.initDrag = function() {

        // Calculator cards
        this.calculatorList.addEventListener(
            'dragover',
            function(event) {

                event.preventDefault();

                if (self.draggedCalculator === null) {
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
                    calculatorUnderMouse === self.draggedCalculator
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

                    self.calculatorList.insertBefore(
                        self.draggedCalculator,
                        calculatorUnderMouse
                    );

                } else {

                    self.calculatorList.insertBefore(
                        self.draggedCalculator,
                        calculatorUnderMouse.nextSibling
                    );
                }
            }
        );


        this.calculatorList.addEventListener(
            'drop',
            function() {

                self.syncControlPanelOrder();
                self.saveCalculators();
            }
        );


        // Control Panel
        this.controlList.addEventListener(
            'dragstart',
            function(event) {

                self.draggedControlRow =
                    event.target.closest(
                        '.calculator-control-row'
                    );
            }
        );


        this.controlList.addEventListener(
            'dragover',
            function(event) {

                event.preventDefault();

                if (self.draggedControlRow === null) {
                    return;
                }

                const controlRowUnderMouse =
                    event.target.closest(
                        '.calculator-control-row'
                    );

                if (
                    controlRowUnderMouse === null ||
                    controlRowUnderMouse === self.draggedControlRow
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

                    self.controlList.insertBefore(
                        self.draggedControlRow,
                        controlRowUnderMouse
                    );

                } else {

                    self.controlList.insertBefore(
                        self.draggedControlRow,
                        controlRowUnderMouse.nextSibling
                    );
                }
            }
        );


        this.controlList.addEventListener(
            'drop',
            function() {

                self.syncCalculatorOrder();
                self.saveCalculators();
            }
        );


        this.controlList.addEventListener(
            'dragend',
            function() {

                self.draggedControlRow = null;
            }
        );
    };


    // =========================================
    // GLOBAL BUTTON EVENTS
    // =========================================

    this.bindEvents = function() {

        this.addCalculatorButton.addEventListener(
            'click',
            function() {

                self.createCalculator();
                self.saveCalculators();
            }
        );


        this.collapseAllButton.addEventListener(
            'click',
            function() {

                self.setAllCalculatorsMinimized(
                    true
                );
            }
        );


        this.expandAllButton.addEventListener(
            'click',
            function() {

                self.setAllCalculatorsMinimized(
                    false
                );
            }
        );
    };


    // =========================================
    // INITIALIZATION
    // =========================================

    this.init = function() {

        this.initVars();
        this.loadCalculators();
        this.bindEvents();
        this.initDrag();
    };


    this.init();
};


class Calculator {

    constructor(
        container,
        calculatorData = null,
        calculatorId,
        app
    ) {
    
        this.container = container;
        this.app = app;
    
        this.container.calculatorInstance =
            this;
    
        this.id = calculatorId;

    
        this.container.draggable = false;
        
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
        
                this.app.draggedControlRow =
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
                this.app.saveCalculators();
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
                this.app.saveCalculators();
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
                this.app.saveCalculators();
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
    
                this.app.draggedCalculator =
                    this.container;
            }
        );
    
    
        // Finish dragging calculator
        this.container.addEventListener(
            'dragend',
            () => {
    
                this.container.draggable = false;
    
                this.app.saveCalculators();
    
                this.app.draggedCalculator = null;
            }
        );
    
    
        // Clear calculator
        this.clearButton.addEventListener(
            'click',
            () => {
    
                this.clear();
                this.app.saveCalculators();
            }
        );
    
    
        // Remove calculator using calculator X
        this.removeCalculatorButton.addEventListener(
            'click',
            () => {
    
                this.removeCalculator();
                this.app.saveCalculators();
            }
        );
    
    
        // Minimize calculator
        this.minimizeCalculatorButton.addEventListener(
            'click',
            () => {
    
                this.minimizeCalculator();
                this.app.saveCalculators();
            }
        );
    }
}

// =========================================
// START APPLICATION
// =========================================

new window.CalculatorApp({
    calculatorList: '.calculator-list',
    controlList: '.calculator-control-list',
    addButton: '.add-calculator-button',
    collapseAllButton: '.collapse-all-button',
    expandAllButton: '.expand-all-button',
    calculatorTemplate: '#calculator-template'
});