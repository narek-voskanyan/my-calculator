window.DragRaw = function(options) {

    var self = this;

    this.initVars = function() {

        this.options = options;
    
        this.container =
            document.querySelector(
                options.container
            );
    
        this.itemSelector =
            options.item;
    
        this.handleSelector =
            options.handle;

        this.axis =
            options.axis || 'x';
    
        this.onDrop =
            options.onDrop;
    
        this.draggedElement = null;
    };

    this.bindEvents = function() {

        this.container.addEventListener(
            'mousedown',
            function(event) {
    
                const handle =
                    event.target.closest(
                        self.handleSelector
                    );
    
                if (handle === null) {
                    return;
                }
    
                const item =
                    handle.closest(
                        self.itemSelector
                    );
    
                if (item === null) {
                    return;
                }
    
                self.draggedElement = item;
    
            }
        );
        document.addEventListener(
            'mousemove',
            function(event) {
        
                if (self.draggedElement === null) {
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
        
                const itemUnderMouse =
                    elementUnderMouse.closest(
                        self.itemSelector
                    );
        
                if (
                    itemUnderMouse === null ||
                    itemUnderMouse === self.draggedElement
                ) {
                    return;
                }
        
                const rectangle =
                    itemUnderMouse.getBoundingClientRect();
        
                    let pointerPosition;
                    let middlePosition;
                    
                    if (self.axis === 'y') {
                    
                        pointerPosition =
                            event.clientY;
                    
                        middlePosition =
                            rectangle.top +
                            rectangle.height / 2;
                    
                    } else {
                    
                        pointerPosition =
                            event.clientX;
                    
                        middlePosition =
                            rectangle.left +
                            rectangle.width / 2;
                    }
                    
                    if (pointerPosition < middlePosition) {
                    
                        self.container.insertBefore(
                            self.draggedElement,
                            itemUnderMouse
                        );
                    
                    } else {
                    
                        self.container.insertBefore(
                            self.draggedElement,
                            itemUnderMouse.nextSibling
                        );
                    }
            }
        );
        document.addEventListener(
            'mouseup',
            function() {
        
                if (self.draggedElement === null) {
                    return;
                }

    
                if (self.onDrop) {
                    self.onDrop();
                }
        
                self.draggedElement = null;
            }
        );
    };

    this.init = function() {

        this.initVars();
        this.bindEvents();
    };

    this.init();
};

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

        // First visit: no LocalStorage yet
        if (calculatorsJSON === null) {

            this.createCalculator();
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
            function(calculatorData) {

                self.createCalculator(
                    calculatorData
                );
            }
        );
    };

    this.saveCalculators = function() {

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
            JSON.stringify(calculatorsData);

        localStorage.setItem(
            'calculators',
            calculatorsJSON
        );
    };

    this.setAllCalculatorsMinimized = function(minimized) {

        const calculators =
            document.querySelectorAll(
                '.calculator'
            );
    
        calculators.forEach(function(calculator) {
    
            calculator.calculatorInstance.setMinimized(
                minimized
            );
        });
    
        self.saveCalculators();
    };
    // =========================================
    // EVENTS
    // =========================================
    this.bindEvents = function() {

        // Add calculator
        this.addCalculatorButton.addEventListener(
            'click',
            function() {
    
                self.createCalculator();
                self.saveCalculators();
            }
        );
    
        // Collapse all calculators
        this.collapseAllButton.addEventListener(
            'click',
            function() {
    
                self.setAllCalculatorsMinimized(
                    true
                );
            }
        );
    
        // Expand all calculators
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

    this.initDrag = function() {

        // Calculator cards
        this.cardDrag =
            new window.DragRaw({
                container: '.calculator-list',
                item: '.calculator',
                handle: '.drag-calculator-button',
                axis: 'x',
    
                onDrop: function() {
    
                    self.syncControlPanelOrder();
                    self.saveCalculators();
                }
            });
    
    
        // Control Panel rows
        this.panelDrag =
            new window.DragRaw({
                container: '.calculator-control-list',
                item: '.calculator-control-row',
                handle: '.calculator-control-drag',
                axis: 'y',
    
                onDrop: function() {
    
                    self.syncCalculatorOrder();
                    self.saveCalculators();
                }
            });
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
    
    /*
        // Enable dragging only from drag button
        dragControlButton.addEventListener(
            'mousedown',
            () => {
    
                controlRow.draggable =
                    true;
            }
        );*/
    
    /*
        // Disable dragging when drag finishes
        controlRow.addEventListener(
            'dragend',
            () => {
    
                controlRow.draggable =
                    false;
    
                draggedControlRow =
                    null;
            }
        );*/
    
    
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

    window.calculatorApp =
    new window.CalculatorApp({

        calculatorList:
            '.calculator-list',

        controlList:
            '.calculator-control-list',

        addButton:
            '.add-calculator-button',

        collapseAllButton:
            '.collapse-all-button',

        expandAllButton:
            '.expand-all-button',

        calculatorTemplate:
            '#calculator-template'
    });