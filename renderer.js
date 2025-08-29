const { ipcRenderer } = require('electron');

// Window controls
document.getElementById('minimize-btn').addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

document.getElementById('maximize-btn').addEventListener('click', () => {
    ipcRenderer.send('window-maximize');
});

document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

// Sidebar toggle functionality
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarToggle.classList.toggle('collapsed');
});

// Navigation functionality
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show corresponding page
        const pageId = item.dataset.page + '-page';
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Initialize enhanced perceptron demo if needed
            if (pageId === 'perceptron-enhanced-page' && !enhancedPerceptronDemo) {
                setTimeout(() => {
                    enhancedPerceptronDemo = new EnhancedPerceptronDemo();
                }, 100);
            }
        }
    });
});

// Perceptron interactive demo
class PerceptronDemo {
    constructor() {
        this.input1Slider = document.getElementById('input1');
        this.input2Slider = document.getElementById('input2');
        this.weight1Slider = document.getElementById('weight1');
        this.weight2Slider = document.getElementById('weight2');
        this.biasSlider = document.getElementById('bias');
        
        this.input1Value = document.getElementById('input1-value');
        this.input2Value = document.getElementById('input2-value');
        this.weight1Value = document.getElementById('weight1-value');
        this.weight2Value = document.getElementById('weight2-value');
        this.biasValue = document.getElementById('bias-value');
        
        this.calculationDisplay = document.getElementById('calculation');
        this.outputValueDisplay = document.getElementById('output-value');
        this.outputExplanationDisplay = document.getElementById('output-explanation');
        
        this.initializeEventListeners();
        this.updateCalculation();
    }
    
    initializeEventListeners() {
        const sliders = [
            this.input1Slider,
            this.input2Slider,
            this.weight1Slider,
            this.weight2Slider,
            this.biasSlider
        ];
        
        sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                this.updateValues();
                this.updateCalculation();
            });
        });
    }
    
    updateValues() {
        this.input1Value.textContent = parseFloat(this.input1Slider.value).toFixed(1);
        this.input2Value.textContent = parseFloat(this.input2Slider.value).toFixed(1);
        this.weight1Value.textContent = parseFloat(this.weight1Slider.value).toFixed(1);
        this.weight2Value.textContent = parseFloat(this.weight2Slider.value).toFixed(1);
        this.biasValue.textContent = parseFloat(this.biasSlider.value).toFixed(1);
    }
    
    updateCalculation() {
        const x1 = parseFloat(this.input1Slider.value);
        const x2 = parseFloat(this.input2Slider.value);
        const w1 = parseFloat(this.weight1Slider.value);
        const w2 = parseFloat(this.weight2Slider.value);
        const b = parseFloat(this.biasSlider.value);
        
        // Calculate weighted sum
        const z = (w1 * x1) + (w2 * x2) + b;
        
        // Apply step function
        const output = z >= 0 ? 1 : 0;
        
        // Update displays
        this.calculationDisplay.textContent = `z = (${w1.toFixed(1)} × ${x1.toFixed(1)}) + (${w2.toFixed(1)} × ${x2.toFixed(1)}) + ${b.toFixed(1)} = ${z.toFixed(2)}`;
        this.outputValueDisplay.textContent = output;
        this.outputExplanationDisplay.textContent = `(z ${z >= 0 ? '≥' : '<'} 0, so output = ${output})`;
        
        // Update output value color based on result
        this.outputValueDisplay.style.backgroundColor = output === 1 ? '#10b981' : '#ef4444';
        this.outputValueDisplay.style.color = 'white';
    }
}

// Button event listeners
document.getElementById('next-lesson-btn').addEventListener('click', () => {
    alert('Next lesson: Neural Networks (Coming Soon!)');
});

document.getElementById('practice-btn').addEventListener('click', () => {
    alert('Practice problems coming soon!');
});

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const demo = new PerceptronDemo();
});

// Enhanced Perceptron Demo Class
class EnhancedPerceptronDemo {
    constructor() {
        this.isAnimating = false;
        this.animationSpeed = 1;
        this.currentStep = 1;
        
        // Input values
        this.inputs = { x1: 0.8, x2: 0.6, x3: 0.4, bias: 0.1 };
        this.weights = { w1: 0.7, w2: 0.5, w3: -0.3, b: 0.1 };
        
        this.initializeEventListeners();
        this.initializeStepNavigation();
        this.initializeFunctionTabs();
        this.initializeCanvases();
        this.updateCalculations();
    }
    
    initializeEventListeners() {
        // Animation controls
        document.getElementById('play-animation')?.addEventListener('click', () => this.playAnimation());
        document.getElementById('pause-animation')?.addEventListener('click', () => this.pauseAnimation());
        document.getElementById('reset-animation')?.addEventListener('click', () => this.resetAnimation());
        
        // Speed control
        const speedControl = document.getElementById('animation-speed');
        if (speedControl) {
            speedControl.addEventListener('input', (e) => {
                this.animationSpeed = parseFloat(e.target.value);
                document.getElementById('speed-value').textContent = this.animationSpeed + 'x';
            });
        }
        
        // Parameter controls
        const paramInputs = [
            'enhanced-input1', 'enhanced-input2', 'enhanced-input3', 'enhanced-bias',
            'enhanced-weight1', 'enhanced-weight2', 'enhanced-weight3'
        ];
        
        paramInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.updateParameterValues();
                    this.updateCalculations();
                    this.updateVisualizations();
                });
            }
        });
        
        // Navigation buttons
        document.getElementById('back-to-basic')?.addEventListener('click', () => {
            this.navigateToPage('perceptron');
        });
        
        document.getElementById('next-advanced-lesson')?.addEventListener('click', () => {
            alert('Advanced topics coming soon!');
        });
    }
    
    initializeStepNavigation() {
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateStep(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateStep(1));
        }
        
        this.updateStepDisplay();
    }
    
    initializeFunctionTabs() {
        const functionTabs = document.querySelectorAll('.function-tab');
        functionTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetFunction = e.target.dataset.function;
                this.switchFunctionTab(targetFunction);
            });
        });
    }
    
    initializeCanvases() {
        this.drawStepFunction();
        this.drawDecisionBoundary();
    }
    
    updateParameterValues() {
        // Update input values
        this.inputs.x1 = parseFloat(document.getElementById('enhanced-input1')?.value || 0.8);
        this.inputs.x2 = parseFloat(document.getElementById('enhanced-input2')?.value || 0.6);
        this.inputs.x3 = parseFloat(document.getElementById('enhanced-input3')?.value || 0.4);
        this.inputs.bias = parseFloat(document.getElementById('enhanced-bias')?.value || 0.1);
        
        // Update weights
        this.weights.w1 = parseFloat(document.getElementById('enhanced-weight1')?.value || 0.7);
        this.weights.w2 = parseFloat(document.getElementById('enhanced-weight2')?.value || 0.5);
        this.weights.w3 = parseFloat(document.getElementById('enhanced-weight3')?.value || -0.3);
        this.weights.b = parseFloat(document.getElementById('enhanced-bias')?.value || 0.1);
        
        // Update display values
        document.getElementById('enhanced-input1-value').textContent = this.inputs.x1.toFixed(1);
        document.getElementById('enhanced-input2-value').textContent = this.inputs.x2.toFixed(1);
        document.getElementById('enhanced-input3-value').textContent = this.inputs.x3.toFixed(1);
        document.getElementById('enhanced-bias-value').textContent = this.inputs.bias.toFixed(1);
        
        document.getElementById('enhanced-weight1-value').textContent = this.weights.w1.toFixed(1);
        document.getElementById('enhanced-weight2-value').textContent = this.weights.w2.toFixed(1);
        document.getElementById('enhanced-weight3-value').textContent = this.weights.w3.toFixed(1);
    }
    
    updateCalculations() {
        // Calculate weighted sum
        const z = (this.weights.w1 * this.inputs.x1) + 
                  (this.weights.w2 * this.inputs.x2) + 
                  (this.weights.w3 * this.inputs.x3) + 
                  this.weights.b;
        
        // Apply step function
        const output = z >= 0 ? 1 : 0;
        
        // Update displays
        document.getElementById('input-1-display').textContent = this.inputs.x1.toFixed(1);
        document.getElementById('input-2-display').textContent = this.inputs.x2.toFixed(1);
        document.getElementById('input-3-display').textContent = this.inputs.x3.toFixed(1);
        document.getElementById('bias-display').textContent = this.inputs.bias.toFixed(1);
        
        document.getElementById('weight-1-display').textContent = this.weights.w1.toFixed(1);
        document.getElementById('weight-2-display').textContent = this.weights.w2.toFixed(1);
        document.getElementById('weight-3-display').textContent = this.weights.w3.toFixed(1);
        document.getElementById('weight-bias-display').textContent = this.weights.b.toFixed(1);
        
        const calculationText = `${this.inputs.x1.toFixed(1)}×${this.weights.w1.toFixed(1)} + ${this.inputs.x2.toFixed(1)}×${this.weights.w2.toFixed(1)} + ${this.inputs.x3.toFixed(1)}×${this.weights.w3.toFixed(1)} + ${this.weights.b.toFixed(1)} = ${z.toFixed(2)}`;
        document.getElementById('sum-calculation').textContent = calculationText;
        
        document.getElementById('final-output').textContent = output;
        document.getElementById('output-reasoning').textContent = `z = ${z.toFixed(2)} ${z >= 0 ? '≥' : '<'} 0 → Output = ${output}`;
        
        // Update live calculations in function panels
        document.getElementById('live-weighted-sum').textContent = 
            `Current: z = (${this.weights.w1.toFixed(1)}×${this.inputs.x1.toFixed(1)}) + (${this.weights.w2.toFixed(1)}×${this.inputs.x2.toFixed(1)}) + (${this.weights.w3.toFixed(1)}×${this.inputs.x3.toFixed(1)}) + ${this.weights.b.toFixed(1)} = ${z.toFixed(2)}`;
        
        document.getElementById('live-step-function').textContent = 
            `Current: f(${z.toFixed(2)}) = ${output} (since ${z.toFixed(2)} ${z >= 0 ? '≥' : '<'} 0)`;
        
        // Update step visualizations
        this.updateStepVisualizations(z, output);
    }
    
    updateStepVisualizations(z, output) {
        // Update step 1 visuals
        const miniInputs = document.querySelectorAll('.mini-input');
        if (miniInputs.length >= 3) {
            miniInputs[0].textContent = `x₁=${this.inputs.x1.toFixed(1)}`;
            miniInputs[1].textContent = `x₂=${this.inputs.x2.toFixed(1)}`;
            miniInputs[2].textContent = `x₃=${this.inputs.x3.toFixed(1)}`;
        }
        
        // Update step 2 visuals
        const calculations = document.querySelectorAll('.calc');
        if (calculations.length >= 3) {
            calculations[0].textContent = `${this.inputs.x1.toFixed(1)} × ${this.weights.w1.toFixed(1)} = ${(this.inputs.x1 * this.weights.w1).toFixed(2)}`;
            calculations[1].textContent = `${this.inputs.x2.toFixed(1)} × ${this.weights.w2.toFixed(1)} = ${(this.inputs.x2 * this.weights.w2).toFixed(2)}`;
            calculations[2].textContent = `${this.inputs.x3.toFixed(1)} × ${this.weights.w3.toFixed(1)} = ${(this.inputs.x3 * this.weights.w3).toFixed(2)}`;
        }
        
        // Update step 3 and 4 visuals
        document.querySelector('.sum-calc').textContent = 
            `z = ${(this.inputs.x1 * this.weights.w1).toFixed(2)} + ${(this.inputs.x2 * this.weights.w2).toFixed(2)} + ${(this.inputs.x3 * this.weights.w3).toFixed(2)} + ${this.weights.b.toFixed(1)} = ${z.toFixed(2)}`;
        
        document.querySelector('.activation-calc').textContent = 
            `f(${z.toFixed(2)}) = ${output} (since ${z.toFixed(2)} ${z >= 0 ? '≥' : '<'} 0)`;
    }
    
    updateVisualizations() {
        this.drawDecisionBoundary();
    }
    
    playAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.startDataFlowAnimation();
    }
    
    pauseAnimation() {
        this.isAnimating = false;
        this.stopDataFlowAnimation();
    }
    
    resetAnimation() {
        this.isAnimating = false;
        this.stopDataFlowAnimation();
        this.resetAnimationElements();
    }
    
    startDataFlowAnimation() {
        // Add active classes to trigger CSS animations
        const pulses = document.querySelectorAll('.data-pulse');
        const flows = document.querySelectorAll('.data-flow');
        
        pulses.forEach((pulse, index) => {
            setTimeout(() => {
                pulse.classList.add('active');
            }, index * 200 / this.animationSpeed);
        });
        
        flows.forEach((flow, index) => {
            setTimeout(() => {
                flow.classList.add('active');
            }, (index * 200 + 500) / this.animationSpeed);
        });
        
        // Animate node highlights
        this.animateNodeHighlights();
    }
    
    stopDataFlowAnimation() {
        const pulses = document.querySelectorAll('.data-pulse');
        const flows = document.querySelectorAll('.data-flow');
        
        pulses.forEach(pulse => pulse.classList.remove('active'));
        flows.forEach(flow => flow.classList.remove('active'));
    }
    
    resetAnimationElements() {
        this.stopDataFlowAnimation();
        
        // Reset node highlights
        const nodes = document.querySelectorAll('.node-circle');
        nodes.forEach(node => {
            node.style.transform = '';
            node.style.boxShadow = '';
        });
    }
    
    animateNodeHighlights() {
        const nodes = document.querySelectorAll('.node-circle');
        
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.style.transform = 'scale(1.1)';
                node.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                
                setTimeout(() => {
                    node.style.transform = 'scale(1)';
                    node.style.boxShadow = '';
                }, 300 / this.animationSpeed);
            }, index * 200 / this.animationSpeed);
        });
    }
    
    navigateStep(direction) {
        const totalSteps = 4;
        this.currentStep = Math.max(1, Math.min(totalSteps, this.currentStep + direction));
        this.updateStepDisplay();
    }
    
    updateStepDisplay() {
        // Update step cards
        document.querySelectorAll('.step-card').forEach((card, index) => {
            card.classList.toggle('active', index + 1 === this.currentStep);
        });
        
        // Update navigation
        document.getElementById('step-indicator').textContent = `Step ${this.currentStep} of 4`;
        document.getElementById('prev-step').disabled = this.currentStep === 1;
        document.getElementById('next-step').disabled = this.currentStep === 4;
    }
    
    switchFunctionTab(targetFunction) {
        // Update tabs
        document.querySelectorAll('.function-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.function === targetFunction);
        });
        
        // Update panels
        document.querySelectorAll('.function-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${targetFunction}-panel`);
        });
        
        // Redraw canvases if needed
        if (targetFunction === 'step-function') {
            setTimeout(() => this.drawStepFunction(), 100);
        } else if (targetFunction === 'decision-boundary') {
            setTimeout(() => this.drawDecisionBoundary(), 100);
        }
    }
    
    drawStepFunction() {
        const canvas = document.getElementById('step-function-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, height - 50);
        ctx.lineTo(width - 20, height - 50);
        ctx.moveTo(width / 2, 20);
        ctx.lineTo(width / 2, height - 20);
        ctx.stroke();
        
        // Draw step function
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, height - 50);
        ctx.lineTo(width / 2, height - 50);
        ctx.moveTo(width / 2, 50);
        ctx.lineTo(width - 20, 50);
        ctx.stroke();
        
        // Draw vertical line at threshold
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(width / 2, 50);
        ctx.lineTo(width / 2, height - 50);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Add labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('0', width / 2, height - 30);
        ctx.fillText('z', width - 10, height - 30);
        ctx.save();
        ctx.translate(25, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('f(z)', 0, 0);
        ctx.restore();
    }
    
    drawDecisionBoundary() {
        const canvas = document.getElementById('decision-boundary-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, height - 30);
        ctx.lineTo(width - 20, height - 30);
        ctx.moveTo(30, height - 30);
        ctx.lineTo(30, 20);
        ctx.stroke();
        
        // Draw decision boundary line (simplified for x1, x2 only)
        if (this.weights.w1 !== 0 && this.weights.w2 !== 0) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            // Calculate line points: w1*x1 + w2*x2 + b = 0 => x2 = -(w1*x1 + b)/w2
            const x1_start = 0;
            const x1_end = 1;
            const x2_start = -(this.weights.w1 * x1_start + this.weights.b) / this.weights.w2;
            const x2_end = -(this.weights.w1 * x1_end + this.weights.b) / this.weights.w2;
            
            const canvasX1 = 30 + (x1_start * (width - 50));
            const canvasY1 = height - 30 - (x2_start * (height - 50));
            const canvasX2 = 30 + (x1_end * (width - 50));
            const canvasY2 = height - 30 - (x2_end * (height - 50));
            
            ctx.moveTo(canvasX1, canvasY1);
            ctx.lineTo(canvasX2, canvasY2);
            ctx.stroke();
        }
        
        // Draw sample points
        ctx.fillStyle = '#10b981';
        ctx.fillRect(30 + (this.inputs.x1 * (width - 50)) - 3, 
                    height - 30 - (this.inputs.x2 * (height - 50)) - 3, 6, 6);
        
        // Add labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('x₁', width - 10, height - 10);
        ctx.save();
        ctx.translate(15, 20);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('x₂', 0, 0);
        ctx.restore();
    }
    
    navigateToPage(pageId) {
        const navItems = document.querySelectorAll('.nav-item');
        const pages = document.querySelectorAll('.page');
        
        navItems.forEach(nav => nav.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');
        document.getElementById(`${pageId}-page`)?.classList.add('active');
    }
}

// Initialize enhanced perceptron demo when page loads
let enhancedPerceptronDemo = null;

// Logo click handler
document.getElementById('app-logo').addEventListener('click', () => {
    // Reset to first page
    navItems.forEach(nav => nav.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    
    document.querySelector('[data-page="perceptron"]').classList.add('active');
    document.getElementById('perceptron-page').classList.add('active');
});