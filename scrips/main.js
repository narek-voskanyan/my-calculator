window.CalculatorApp = function(options) {

    var self = this;

    // =========================================
    // VARIABLES
    // =========================================

    this.initVars = function() {
        this.options = options;

        this.calculatorList = document.querySelector(options.calculatorList);
        this.controlList = document.querySelector(options.controlList);
        this.addCalculatorButton = document.querySelector(options.addButton);
        this.collapseAllButton = document.querySelector(options.collapseAllButton);
        this.expandAllButton = document.querySelector(options.expandAllButton);
        this.calculatorTemplate = document.querySelector(options.calculatorTemplate);

        this.calculatorCounter = 0;
        this.calculators = [];
        this.draggedCalculator = null;
        this.draggedControlRow = null;
        this.dragTargetId = null;
        this.dragPosition = null;
        this.controlDragTargetId = null;
        this.controlDragPosition = null;
    };

    // =========================================
    // CREATE CALCULATOR
    // =========================================

    this.createCalculator = function(calculatorData = null) {
        let data;

        if (calculatorData !== null) {
            data = calculatorData;

            const idNumber = Number(String(data.id).replace('calc-', ''));

            if (Number.isFinite(idNumber) && idNumber > this.calculatorCounter) {
                this.calculatorCounter = idNumber;
            }
        } else {
            this.calculatorCounter++;

            data = {
                id: `calc-${this.calculatorCounter}`,
                title: `Calculator ${this.calculatorCounter}`,
                a: '',
                b: '',
                operation: null,
                result: null,
                error: '',
                minimized: false,
                resetOperation: false
            };

            this.calculators.push(data);
        }

        const calculatorBlueprint = this.calculatorTemplate.content.querySelector('.calculator');
        const newCalculatorElement = calculatorBlueprint.cloneNode(true);

        this.calculatorList.appendChild(newCalculatorElement);

        new Calculator(newCalculatorElement, data, this);
    };

    // =========================================
    // REMOVE CALCULATOR
    // =========================================

    this.removeCalculator = function(calculatorId) {
        this.calculators = this.calculators.filter(function(calculatorData) {
            return calculatorData.id !== calculatorId;
        });

        const calculator = this.calculatorList.querySelector(
            `.calculator[data-calculator-id="${calculatorId}"]`
        );

        if (calculator !== null) {
            calculator.remove();
        }

        const controlRow = this.controlList.querySelector(
            `.calculator-control-row[data-calculator-id="${calculatorId}"]`
        );

        if (controlRow !== null) {
            controlRow.remove();
        }

        // Show the empty message when all calculators are removed.
        if (this.calculators.length === 0) {
            const emptyMessage = document.createElement('p');

            emptyMessage.classList.add('control-panel-empty');
            emptyMessage.textContent = 'The list is empty.';

            this.controlList.appendChild(emptyMessage);
        }

        this.saveCalculators();
    };

    // =========================================
    // TOGGLE CALCULATOR
    // =========================================

    this.toggleCalculator = function(calculatorId) {
        const calculatorData = this.calculators.find(function(data) {
            return data.id === calculatorId;
        });

        if (calculatorData === undefined) {
            return;
        }

        // Update shared state first.
        calculatorData.minimized = !calculatorData.minimized;

        // Update the calculator card from the shared state.
        const calculator = this.calculatorList.querySelector(
            `.calculator[data-calculator-id="${calculatorId}"]`
        );

        if (calculator !== null) {
            calculator.calculatorInstance.setMinimized(calculatorData.minimized);
        }

        this.saveCalculators();
    };

    // =========================================
    // NORMALIZE CALCULATOR DATA
    // =========================================

    this.normalizeCalculatorData = function(calculatorData) {
        let idNumber;

        if (
            typeof calculatorData.id === 'string' &&
            calculatorData.id.startsWith('calc-')
        ) {
            idNumber = Number(calculatorData.id.replace('calc-', ''));
        } else {
            idNumber = Number(calculatorData.id);
        }

        if (!Number.isFinite(idNumber)) {
            this.calculatorCounter++;
            idNumber = this.calculatorCounter;
        } else if (idNumber > this.calculatorCounter) {
            this.calculatorCounter = idNumber;
        }

        let result = null;
        let error = calculatorData.error || '';

        if (
            calculatorData.result !== null &&
            calculatorData.result !== undefined &&
            calculatorData.result !== '' &&
            calculatorData.result !== '—'
        ) {
            const numericResult = Number(calculatorData.result);

            if (Number.isFinite(numericResult)) {
                result = numericResult;
            } else if (error === '') {
                error = String(calculatorData.result);
            }
        }

        return {
            id: `calc-${idNumber}`,
            title: calculatorData.title || `Calculator ${idNumber}`,
            a: calculatorData.a !== undefined
                ? String(calculatorData.a)
                : String(calculatorData.firstNumber ?? ''),
            b: calculatorData.b !== undefined
                ? String(calculatorData.b)
                : String(calculatorData.secondNumber ?? ''),
            operation: calculatorData.operation !== undefined
                ? calculatorData.operation
                : (calculatorData.operator ?? null),
            result: result,
            error: error,
            minimized: Boolean(calculatorData.minimized),
            resetOperation: Boolean(calculatorData.resetOperation)
        };
    };

    // =========================================
    // LOAD CALCULATORS
    // =========================================

    this.loadCalculators = function() {
        let calculatorsJSON;

        try {
            calculatorsJSON = localStorage.getItem('calculators');
        } catch (error) {
            console.error('Failed to read calculators from localStorage:', error);

            this.createCalculator();
            return;
        }

        // First visit: no saved data yet.
        if (calculatorsJSON === null) {
            this.createCalculator();
            this.saveCalculators();
            return;
        }

        let calculatorsData;

        try {
            calculatorsData = JSON.parse(calculatorsJSON);
        } catch (error) {
            console.error('Failed to parse saved calculators:', error);

            this.createCalculator();
            this.saveCalculators();
            return;
        }

        // Saved data must be an array.
        if (!Array.isArray(calculatorsData)) {
            console.error('Saved calculators data is not an array.');

            this.createCalculator();
            this.saveCalculators();
            return;
        }

        // An empty array is valid.
        // It means the user removed all calculators.
        if (calculatorsData.length === 0) {
            this.calculators = [];
            return;
        }

        this.calculators = calculatorsData
            .filter(function(calculatorData) {
                return (
                    calculatorData !== null &&
                    typeof calculatorData === 'object' &&
                    !Array.isArray(calculatorData)
                );
            })
            .map(function(calculatorData) {
                return self.normalizeCalculatorData(calculatorData);
            });

        this.calculators.forEach(function(calculatorData) {
            self.createCalculator(calculatorData);
        });

        // Save normalized data.
        this.saveCalculators();
    };

    // =========================================
    // SAVE CALCULATORS
    // =========================================

    this.saveCalculators = function() {
        try {
            const calculatorsJSON = JSON.stringify(this.calculators);
            localStorage.setItem('calculators', calculatorsJSON);
        } catch (error) {
            console.error('Failed to save calculators to localStorage:', error);
        }
    };

    // =========================================
    // MINIMIZE ALL
    // =========================================

    this.setAllCalculatorsMinimized = function(minimized) {
        const calculators = this.calculatorList.querySelectorAll('.calculator');

        calculators.forEach(function(calculator) {
            calculator.calculatorInstance.setMinimized(minimized);
        });

        this.saveCalculators();
    };

    // =========================================
    // SYNC ORDER FROM STATE TO DOM
    // =========================================

    this.syncOrderFromState = function() {
        this.calculators.forEach(function(calculatorData) {
            const calculator = self.calculatorList.querySelector(
                `.calculator[data-calculator-id="${calculatorData.id}"]`
            );

            const controlRow = self.controlList.querySelector(
                `.calculator-control-row[data-calculator-id="${calculatorData.id}"]`
            );

            if (calculator !== null) {
                self.calculatorList.appendChild(calculator);
            }

            if (controlRow !== null) {
                self.controlList.appendChild(controlRow);
            }
        });
    };

    // =========================================
    // MOVE CALCULATOR
    // =========================================

    this.moveCalculator = function(draggedId, targetId, position) {
        if (draggedId === targetId) {
            return;
        }

        const draggedIndex = this.calculators.findIndex(function(calculatorData) {
            return calculatorData.id === draggedId;
        });

        if (draggedIndex === -1) {
            return;
        }

        const draggedCalculator = this.calculators.splice(draggedIndex, 1)[0];

        const targetIndex = this.calculators.findIndex(function(calculatorData) {
            return calculatorData.id === targetId;
        });

        if (targetIndex === -1) {
            this.calculators.splice(draggedIndex, 0, draggedCalculator);
            return;
        }

        const insertIndex = position === 'after'
            ? targetIndex + 1
            : targetIndex;

        this.calculators.splice(insertIndex, 0, draggedCalculator);

        this.syncOrderFromState();
        this.saveCalculators();
    };

    // =========================================
    // BROWSER DRAG AND DROP API
    // =========================================

    this.initDrag = function() {
        // Calculator cards
        this.calculatorList.addEventListener('dragover', function(event) {
            event.preventDefault();

            if (self.draggedCalculator === null) {
                return;
            }

            const elementUnderMouse = document.elementFromPoint(
                event.clientX,
                event.clientY
            );

            if (elementUnderMouse === null) {
                return;
            }

            const calculatorUnderMouse = elementUnderMouse.closest('.calculator');

            if (
                calculatorUnderMouse === null ||
                calculatorUnderMouse === self.draggedCalculator
            ) {
                self.dragTargetId = null;
                self.dragPosition = null;
                return;
            }

            const rectangle = calculatorUnderMouse.getBoundingClientRect();
            const middleX = rectangle.left + rectangle.width / 2;

            self.dragTargetId = calculatorUnderMouse.dataset.calculatorId;
            self.dragPosition = event.clientX < middleX ? 'before' : 'after';
        });

        this.calculatorList.addEventListener('drop', function(event) {
            event.preventDefault();

            if (
                self.draggedCalculator === null ||
                self.dragTargetId === null ||
                self.dragPosition === null
            ) {
                return;
            }

            const draggedId = self.draggedCalculator.dataset.calculatorId;

            self.moveCalculator(
                draggedId,
                self.dragTargetId,
                self.dragPosition
            );

            self.dragTargetId = null;
            self.dragPosition = null;
        });

        this.calculatorList.addEventListener('drop', function() {
            self.updateOrderFromCalculatorList();
            self.syncControlPanelOrder();
            self.saveCalculators();
        });

        // Control Panel
        this.controlList.addEventListener('dragstart', function(event) {
            self.draggedControlRow = event.target.closest('.calculator-control-row');
        });

        this.controlList.addEventListener('dragover', function(event) {
            event.preventDefault();
            if (self.draggedControlRow === null) {
                return;
            }
            const controlRowUnderMouse = event.target.closest(
                '.calculator-control-row'
            );
            if (
                controlRowUnderMouse === null ||
                controlRowUnderMouse === self.draggedControlRow
            ) {
                self.controlDragTargetId = null;
                self.controlDragPosition = null;
                return;
            }
            const rectangle = controlRowUnderMouse.getBoundingClientRect();
            const middleY = rectangle.top + rectangle.height / 2;
            self.controlDragTargetId = controlRowUnderMouse.dataset.calculatorId;
            self.controlDragPosition = event.clientY < middleY
                ? 'before'
                : 'after';
        });

        this.controlList.addEventListener('drop', function(event) {
            event.preventDefault();
            if (
                self.draggedControlRow === null ||
                self.controlDragTargetId === null ||
                self.controlDragPosition === null
            ) {
                return;
            }
            const draggedId = self.draggedControlRow.dataset.calculatorId;
            self.moveCalculator(
                draggedId,
                self.controlDragTargetId,
                self.controlDragPosition
            );
            self.controlDragTargetId = null;
            self.controlDragPosition = null;
        });

        this.controlList.addEventListener('dragend', function() {
            self.draggedControlRow = null;
            self.controlDragTargetId = null;
            self.controlDragPosition = null;
        });
    };

    // =========================================
    // GLOBAL BUTTON EVENTS
    // =========================================

    this.bindEvents = function() {
        this.addCalculatorButton.addEventListener('click', function() {
            self.createCalculator();
            self.saveCalculators();
        });

        this.collapseAllButton.addEventListener('click', function() {
            self.setAllCalculatorsMinimized(true);
        });

        this.expandAllButton.addEventListener('click', function() {
            self.setAllCalculatorsMinimized(false);
        });
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

    constructor(container, calculatorData, app) {
        this.container = container;
        this.app = app;
        this.data = calculatorData;

        this.container.calculatorInstance = this;
        this.id = this.data.id;
        this.container.draggable = false;
        this.container.dataset.calculatorId = this.id;

        // Minimized result
        this.minimizedResult = container.querySelector('.calculator-minimized-result');

        // Drag button
        this.dragButton = container.querySelector('.drag-calculator-button');

        // Number inputs
        this.firstNumber = container.querySelector('.first-number');
        this.secondNumber = container.querySelector('.second-number');

        // Checkbox
        this.clearOperatorCheckbox = container.querySelector('.clear-operator-checkbox');

        // Main buttons
        this.calculateButton = container.querySelector('.calculate-button');
        this.clearButton = container.querySelector('.clear-button');

        // Result
        this.resultField = container.querySelector('.result');

        // Window controls
        this.removeCalculatorButton = container.querySelector('.remove-calculator-button');
        this.minimizeCalculatorButton = container.querySelector('.minimize-calculator-button');

        // Calculator title
        this.calculatorTitle = container.querySelector('.calculator-window-title');

        // Radio names must be unique for each calculator
        this.setupRadioButtons();

        // Restore the interface from the saved state
        this.firstNumber.value = this.data.a;
        this.secondNumber.value = this.data.b;

        if (this.data.operation !== null) {
            const savedOperator = this.container.querySelector(
                `.operator-radio[value="${this.data.operation}"]`
            );

            if (savedOperator !== null) {
                savedOperator.checked = true;
            }
        }

        this.clearOperatorCheckbox.checked = this.data.resetOperation;

        this.resultField.textContent = this.data.error || (
            this.data.result === null ? '—' : this.data.result
        );

        if (this.data.minimized) {
            this.container.classList.add('minimized');
            this.minimizeCalculatorButton.textContent = '+';
            this.minimizeCalculatorButton.setAttribute('aria-label', 'Restore calculator');
            this.minimizedResult.textContent = this.setupMinimizedResult();
        }

        this.setupCalculator();
        this.createControlPanelRow();
        this.addEventListeners();
    }

    setupMinimizedResult() {
        const operation = this.data.operation === null ? '' : this.data.operation;

        let result = '—';

        if (this.data.error !== '') {
            result = this.data.error;
        } else if (this.data.result !== null) {
            result = this.data.result;
        }

        return `${this.data.a} ${operation} ${this.data.b} = ${result}`;
    }

    updateControlPanelResult() {
        let result = '—';

        if (this.data.error !== '') {
            result = this.data.error;
        } else if (this.data.result !== null) {
            result = this.data.result;
        }

        this.controlResult.textContent = `Result: ${result}`;
    }

    setupCalculator() {
        this.calculatorTitle.textContent = this.data.title;
    }

    createControlPanelRow() {
        const controlList = document.querySelector('.calculator-control-list');
        const emptyMessage = controlList.querySelector('.control-panel-empty');

        if (emptyMessage !== null) {
            emptyMessage.remove();
        }

        const controlRow = document.createElement('div');

        controlRow.classList.add('calculator-control-row');
        controlRow.dataset.calculatorId = this.id;
        controlRow.draggable = false;

        const dragControlButton = document.createElement('button');

        dragControlButton.classList.add('calculator-control-drag');
        dragControlButton.type = 'button';
        dragControlButton.textContent = '⠿';
        dragControlButton.setAttribute('aria-label', 'Drag calculator');

        // Enable dragging only from drag button
        dragControlButton.addEventListener('mousedown', () => {
            controlRow.draggable = true;
        });

        dragControlButton.addEventListener('mouseup', () => {
            controlRow.draggable = false;
        });

        controlRow.addEventListener('dragend', () => {
            controlRow.draggable = false;
            this.app.draggedControlRow = null;
        });

        const controlTitle = document.createElement('input');

        controlTitle.classList.add('calculator-control-title');
        controlTitle.type = 'text';
        controlTitle.value = this.data.title;

        // Keep title state and calculator card synchronized
        controlTitle.addEventListener('input', () => {
            this.data.title = controlTitle.value;
            this.calculatorTitle.textContent = this.data.title;
            this.app.saveCalculators();
        });

        this.controlResult = document.createElement('span');
        this.controlResult.classList.add('calculator-control-result');

        this.updateControlPanelResult();

        const minimizeControlButton = document.createElement('button');

        minimizeControlButton.classList.add('calculator-control-minimize');
        minimizeControlButton.type = 'button';
        minimizeControlButton.textContent = this.data.minimized ? 'Expand' : 'Collapse';

        minimizeControlButton.addEventListener('click', () => {
            this.app.toggleCalculator(this.id);
        });

        const removeControlButton = document.createElement('button');

        removeControlButton.classList.add('calculator-control-remove');
        removeControlButton.type = 'button';
        removeControlButton.textContent = '×';

        removeControlButton.addEventListener('click', () => {
            this.app.removeCalculator(this.id);
        });

        controlRow.appendChild(dragControlButton);
        controlRow.appendChild(controlTitle);
        controlRow.appendChild(this.controlResult);
        controlRow.appendChild(minimizeControlButton);
        controlRow.appendChild(removeControlButton);
        controlList.appendChild(controlRow);
    }

    setupRadioButtons() {
        const radioButtons = this.container.querySelectorAll('.operator-radio');

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

            radio.id = `operation-${operationName}-${this.id}`;

            const label = radio.nextElementSibling;

            label.setAttribute('for', radio.id);
        });
    }

    calculate(a, b, operation) {
        // Check empty values before Number()
        if (a === '' || b === '') {
            return {
                result: null,
                error: 'Fill in all fields before calculating'
            };
        }

        const firstNumberValue = Number(a);
        const secondNumberValue = Number(b);

        if (
            !Number.isFinite(firstNumberValue) ||
            !Number.isFinite(secondNumberValue)
        ) {
            return {
                result: null,
                error: 'Please enter valid numbers'
            };
        }

        if (operation === null) {
            return {
                result: null,
                error: 'Please select an operation'
            };
        }

        if (operation === '/' && secondNumberValue === 0) {
            return {
                result: null,
                error: 'Error'
            };
        }

        let result;

        if (operation === '*') {
            result = firstNumberValue * secondNumberValue;
        } else if (operation === '/') {
            result = firstNumberValue / secondNumberValue;
        } else if (operation === '+') {
            result = firstNumberValue + secondNumberValue;
        } else if (operation === '-') {
            result = firstNumberValue - secondNumberValue;
        } else {
            return {
                result: null,
                error: 'Please select a valid operation'
            };
        }

        // Do not allow Infinity or another invalid result
        if (!Number.isFinite(result)) {
            return {
                result: null,
                error: 'Error'
            };
        }

        return {
            result: result,
            error: ''
        };
    }

    applyCalculationResult(calculation) {
        // Update state first
        this.data.result = calculation.result;
        this.data.error = calculation.error;

        // Update calculator interface
        this.resultField.textContent = this.data.error !== ''
            ? this.data.error
            : this.data.result;

        // Update Control Panel
        this.updateControlPanelResult();
    }

    clear() {
        // Update state first
        this.data.a = '';
        this.data.b = '';
        this.data.result = null;
        this.data.error = '';

        if (this.data.resetOperation) {
            this.data.operation = null;
        }

        // Update interface
        this.firstNumber.value = this.data.a;
        this.secondNumber.value = this.data.b;

        if (this.data.operation === null) {
            const selectedOperation = this.container.querySelector('.operator-radio:checked');

            if (selectedOperation !== null) {
                selectedOperation.checked = false;
            }
        }

        this.resultField.textContent = '—';
        this.updateControlPanelResult();
    }

    setMinimized(minimized) {
        // Update state first
        this.data.minimized = minimized;

        this.container.classList.toggle('minimized', this.data.minimized);

        this.minimizeCalculatorButton.textContent = this.data.minimized ? '+' : '−';

        this.minimizeCalculatorButton.setAttribute(
            'aria-label',
            this.data.minimized ? 'Restore calculator' : 'Minimize calculator'
        );

        if (this.data.minimized) {
            this.minimizedResult.textContent = this.setupMinimizedResult();
        }

        const controlRow = document.querySelector(
            `.calculator-control-row[data-calculator-id="${this.id}"]`
        );

        if (controlRow !== null) {
            const controlButton = controlRow.querySelector('.calculator-control-minimize');

            if (controlButton !== null) {
                controlButton.textContent = this.data.minimized ? 'Expand' : 'Collapse';
            }
        }
    }

    resetResult() {
        this.data.result = null;
        this.data.error = '';
        this.resultField.textContent = '—';
        this.updateControlPanelResult();
    }

    addEventListeners() {
        this.firstNumber.addEventListener('input', () => {
            this.data.a = this.firstNumber.value;
            this.resetResult();
            this.app.saveCalculators();
        });

        this.secondNumber.addEventListener('input', () => {
            this.data.b = this.secondNumber.value;
            this.resetResult();
            this.app.saveCalculators();
        });

        const operatorRadios = this.container.querySelectorAll('.operator-radio');

        operatorRadios.forEach((radio) => {
            radio.addEventListener('change', () => {
                if (!radio.checked) {
                    return;
                }

                this.data.operation = radio.value;
                this.resetResult();
                this.app.saveCalculators();
            });
        });

        this.clearOperatorCheckbox.addEventListener('change', () => {
            this.data.resetOperation = this.clearOperatorCheckbox.checked;
            this.app.saveCalculators();
        });

        this.calculateButton.addEventListener('click', () => {
            const calculation = this.calculate(this.data.a, this.data.b, this.data.operation);

            this.applyCalculationResult(calculation);
            this.app.saveCalculators();
        });

        // Enable dragging only from drag button
        this.dragButton.addEventListener('mousedown', () => {
            this.container.draggable = true;
        });

        this.dragButton.addEventListener('mouseup', () => {
            this.container.draggable = false;
        });

        this.container.addEventListener('dragstart', () => {
            this.app.draggedCalculator = this.container;
        });

        this.container.addEventListener('dragend', () => {
            this.container.draggable = false;
            this.app.saveCalculators();
            this.app.draggedCalculator = null;
        });

        this.clearButton.addEventListener('click', () => {
            this.clear();
            this.app.saveCalculators();
        });

        this.removeCalculatorButton.addEventListener('click', () => {
            this.app.removeCalculator(this.id);
        });

        this.minimizeCalculatorButton.addEventListener('click', () => {
            this.app.toggleCalculator(this.id);
        });
    }
}

// =========================================
// START APPLICATION
// =========================================

window.calculatorApp = new window.CalculatorApp({
    calculatorList: '.calculator-list',
    controlList: '.calculator-control-list',
    addButton: '.add-calculator-button',
    collapseAllButton: '.collapse-all-button',
    expandAllButton: '.expand-all-button',
    calculatorTemplate: '#calculator-template'
});
