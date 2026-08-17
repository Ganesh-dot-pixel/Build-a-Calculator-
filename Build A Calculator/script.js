class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.displayElement = document.getElementById('display');
        this.expressionElement = document.getElementById('expression');
        this.buttons = document.querySelectorAll('button');
        
        this.attachEventListeners();
        this.updateDisplay();
    }

    attachEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleInput(e.target);
                this.addButtonPulse(e.target);
            });
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    addButtonPulse(button) {
        button.classList.add('button-pressed');
        setTimeout(() => button.classList.remove('button-pressed'), 150);
    }

    handleInput(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;

        switch(action) {
            case 'number':
                this.appendNumber(value);
                break;
            case 'operator':
                this.setOperation(value);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'clear':
                this.clear();
                break;
            case 'decimal':
                this.appendDecimal();
                break;
            case 'backspace':
                this.backspace();
                break;
        }
    }

    handleKeyboard(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.appendNumber(key);
            this.highlightButton(`[data-value="${key}"]`);
        } else if (key === '.') {
            this.appendDecimal();
            this.highlightButton('[data-value="."]');
        } else if (key === '+' || key === '-') {
            this.setOperation(key);
            this.highlightButton(`[data-value="${key}"]`);
        } else if (key === '*') {
            this.setOperation('×');
            this.highlightButton('[data-value="×"]');
        } else if (key === '/') {
            e.preventDefault();
            this.setOperation('÷');
            this.highlightButton('[data-value="÷"]');
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
            this.highlightButton('[data-action="equals"]');
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clear();
            this.highlightButton('[data-action="clear"]');
        } else if (key === 'Backspace') {
            this.backspace();
            this.highlightButton('[data-action="backspace"]');
        }
    }

    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            this.addButtonPulse(button);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = number;
            this.shouldResetScreen = false;
        } else {
            this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        }
        this.updateDisplay();
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0.';
            this.shouldResetScreen = false;
        } else if (!this.currentOperand.includes('.')) {
            this.currentOperand += '.';
        }
        this.updateDisplay();
    }

    setOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    calculate() {
        if (!this.operation || this.previousOperand === '') return;
        
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result;
        switch(this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatResult(result);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    formatResult(num) {
        const rounded = Math.round(num * 1000000000) / 1000000000;
        let result = rounded.toString();
        if (result.length > 12) {
            result = rounded.toExponential(6);
        }
        return result;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    backspace() {
        if (this.shouldResetScreen || this.currentOperand === 'Error') {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        } else if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.operation && this.previousOperand) {
            this.expressionElement.textContent = `${this.previousOperand} ${this.operation}`;
        } else {
            this.expressionElement.textContent = '';
        }
        this.displayElement.textContent = this.currentOperand;
    }
}

const calculator = new Calculator();