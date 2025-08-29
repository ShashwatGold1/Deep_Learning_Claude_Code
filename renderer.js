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
            
            // Initialize training simulator if needed
            if (pageId === 'perceptron-enhanced-page' && !trainingSimulator) {
                setTimeout(() => {
                    trainingSimulator = new PerceptronTrainingSimulator();
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
    
    // Initialize enhanced features for the perceptron page
    setTimeout(() => {
        // Only initialize if we're on the enhanced perceptron page
        if (document.getElementById('enhanced-perceptron-canvas')) {
            const functionBuilder = new FunctionBuilder();
            const enhancedDiagram = new EnhancedPerceptronDiagram();
            const boundaryVisualizer = new BoundaryVisualizer();
        }
    }, 500);
});

// Perceptron Training Simulator Class
class PerceptronTrainingSimulator {
    constructor() {
        this.datasets = {
            and: [
                { x1: 0, x2: 0, target: 0 },
                { x1: 0, x2: 1, target: 0 },
                { x1: 1, x2: 0, target: 0 },
                { x1: 1, x2: 1, target: 1 }
            ],
            or: [
                { x1: 0, x2: 0, target: 0 },
                { x1: 0, x2: 1, target: 1 },
                { x1: 1, x2: 0, target: 1 },
                { x1: 1, x2: 1, target: 1 }
            ],
            custom: [
                { x1: 0.2, x2: 0.1, target: 0 },
                { x1: 0.3, x2: 0.8, target: 1 },
                { x1: 0.7, x2: 0.2, target: 0 },
                { x1: 0.8, x2: 0.9, target: 1 }
            ]
        };
        
        this.currentDataset = 'and';
        this.learningRate = 0.5;
        this.weights = { w1: 0.0, w2: 0.0, bias: 0.0 };
        this.epoch = 0;
        this.currentSampleIndex = 0;
        this.isTraining = false;
        this.isPaused = false;
        this.animationSpeed = 1;
        this.maxEpochs = 100;
        
        this.trainingData = [];
        this.trainingHistory = [];
        
        this.initializeEventListeners();
        this.loadDataset();
        this.resetTraining();
        
        // Initialize enhanced features
        this.functionBuilder = new FunctionBuilder();
        this.enhancedDiagram = new EnhancedPerceptronDiagram();
        this.boundaryVisualizer = new BoundaryVisualizer();
        
        // Setup enhanced animations
        this.setupEnhancedAnimations();
    }
    
    initializeEventListeners() {
        // Dataset selection
        document.getElementById('dataset-select')?.addEventListener('change', (e) => {
            this.currentDataset = e.target.value;
            this.loadDataset();
            this.resetTraining();
        });
        
        // Learning rate
        const learningRateSlider = document.getElementById('learning-rate');
        if (learningRateSlider) {
            learningRateSlider.addEventListener('input', (e) => {
                this.learningRate = parseFloat(e.target.value);
                document.getElementById('learning-rate-value').textContent = this.learningRate.toFixed(1);
            });
        }
        
        // Training controls
        document.getElementById('start-training')?.addEventListener('click', () => this.startTraining());
        document.getElementById('pause-training')?.addEventListener('click', () => this.pauseTraining());
        document.getElementById('step-training')?.addEventListener('click', () => this.stepTraining());
        document.getElementById('reset-training')?.addEventListener('click', () => this.resetTraining());
        
        // Animation speed
        const speedControl = document.getElementById('animation-speed');
        if (speedControl) {
            speedControl.addEventListener('input', (e) => {
                this.animationSpeed = parseFloat(e.target.value);
                document.getElementById('speed-value').textContent = this.animationSpeed + 'x';
            });
        }
        
        // Navigation
        document.getElementById('back-to-basic')?.addEventListener('click', () => {
            this.navigateToPage('perceptron');
        });
        
        document.getElementById('export-results')?.addEventListener('click', () => {
            this.exportResults();
        });
        
        // Enhanced feature controls
        document.getElementById('animate-function-building')?.addEventListener('click', () => {
            this.functionBuilder?.animateFunctionBuilding();
        });
        
        document.getElementById('reset-function-animation')?.addEventListener('click', () => {
            this.functionBuilder?.resetAnimation();
        });
        
        document.getElementById('animate-data-flow')?.addEventListener('click', () => {
            this.enhancedDiagram?.animateDataFlow();
        });
        
        document.getElementById('show-calculations')?.addEventListener('click', () => {
            this.enhancedDiagram?.showLiveCalculations();
        });
        
        document.getElementById('animate-learning-process')?.addEventListener('click', () => {
            this.animateLearningProcess();
        });
        
        document.getElementById('toggle-advanced-mode')?.addEventListener('click', () => {
            this.toggleAdvancedMode();
        });
        
        // Learning animation speed control
        const learningSpeedControl = document.getElementById('learning-animation-speed');
        if (learningSpeedControl) {
            learningSpeedControl.addEventListener('input', (e) => {
                this.learningAnimationSpeed = parseFloat(e.target.value);
                document.getElementById('learning-speed-value').textContent = this.learningAnimationSpeed + 'x';
            });
        }
    }
    
    loadDataset() {
        this.trainingData = this.datasets[this.currentDataset].map((sample, index) => ({
            ...sample,
            output: 0,
            error: 0,
            row: index + 1
        }));
        
        this.updateDataTable();
        this.updateTotalSamples();
        this.drawDecisionBoundary();
        this.updateBoundaryStats();
    }
    
    updateDataTable() {
        const tbody = document.getElementById('training-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.trainingData.forEach((sample, index) => {
            const row = document.createElement('tr');
            if (index === this.currentSampleIndex && this.isTraining) {
                row.classList.add('current-row');
            }
            
            row.innerHTML = `
                <td class="row-number">${sample.row}</td>
                <td class="input-col">${sample.x1}</td>
                <td class="input-col">${sample.x2}</td>
                <td class="target-col">${sample.target}</td>
                <td class="output-col">${sample.output}</td>
                <td class="error-col ${sample.error === 0 ? 'error-0' : 'error-nonzero'}">${sample.error}</td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    updateTotalSamples() {
        document.getElementById('total-samples').textContent = this.trainingData.length;
    }
    
    startTraining() {
        if (this.isTraining && !this.isPaused) return;
        
        this.isTraining = true;
        this.isPaused = false;
        
        document.getElementById('start-training').disabled = true;
        document.getElementById('training-status').textContent = 'Training';
        document.getElementById('training-status').className = 'status-training';
        
        this.trainNextStep();
    }
    
    pauseTraining() {
        this.isPaused = true;
        document.getElementById('start-training').disabled = false;
    }
    
    stepTraining() {
        if (!this.isTraining) {
            this.isTraining = true;
            document.getElementById('training-status').textContent = 'Training';
            document.getElementById('training-status').className = 'status-training';
        }
        
        this.trainNextStep();
        this.isPaused = true;
        document.getElementById('start-training').disabled = false;
    }
    
    resetTraining() {
        this.isTraining = false;
        this.isPaused = false;
        this.epoch = 0;
        this.currentSampleIndex = 0;
        this.weights = { w1: 0.0, w2: 0.0, bias: 0.0 };
        this.trainingHistory = [];
        
        // Reset training data outputs and errors
        this.trainingData.forEach(sample => {
            sample.output = 0;
            sample.error = 0;
        });
        
        document.getElementById('start-training').disabled = false;
        document.getElementById('training-status').textContent = 'Ready';
        document.getElementById('training-status').className = 'status-ready';
        
        this.updateDisplays();
        this.updateDataTable();
        this.drawDecisionBoundary();
    }
    
    trainNextStep() {
        if (!this.isTraining || this.isPaused) return;
        
        // Get current sample
        const sample = this.trainingData[this.currentSampleIndex];
        
        // Forward pass
        const z = this.weights.w1 * sample.x1 + this.weights.w2 * sample.x2 + this.weights.bias;
        const output = z >= 0 ? 1 : 0;
        const error = sample.target - output;
        
        // Update sample data
        sample.output = output;
        sample.error = error;
        
        // Update displays with animation
        this.animateCalculationStep(sample, z, output, error);
        
        // Weight update if there's an error
        if (error !== 0) {
            const oldWeights = { ...this.weights };
            
            this.weights.w1 += this.learningRate * error * sample.x1;
            this.weights.w2 += this.learningRate * error * sample.x2;
            this.weights.bias += this.learningRate * error;
            
            this.animateWeightUpdate(oldWeights, this.weights);
        }
        
        // Move to next sample
        this.currentSampleIndex++;
        
        // Check if epoch is complete
        if (this.currentSampleIndex >= this.trainingData.length) {
            this.currentSampleIndex = 0;
            this.epoch++;
            
            // Check for convergence
            const totalErrors = this.trainingData.reduce((sum, s) => sum + Math.abs(s.error), 0);
            
            if (totalErrors === 0 || this.epoch >= this.maxEpochs) {
                this.completeTraining(totalErrors === 0);
                return;
            }
        }
        
        this.updateDisplays();
        this.updateDataTable();
        this.drawDecisionBoundary();
        
        // Continue training if not paused
        if (!this.isPaused) {
            setTimeout(() => this.trainNextStep(), 1000 / this.animationSpeed);
        }
    }
    
    animateCalculationStep(sample, z, output, error) {
        // Highlight current calculation steps
        this.highlightCalculationStep('step1');
        
        // Update current sample info
        document.getElementById('current-sample-info').textContent = `Row ${sample.row}`;
        document.getElementById('current-x1').textContent = sample.x1;
        document.getElementById('current-x2').textContent = sample.x2;
        document.getElementById('current-target').textContent = sample.target;
        
        setTimeout(() => {
            // Step 1: Weight Multiplication
            document.getElementById('mult1').innerHTML = 
                `x₁ × w₁ = <span class="highlight">${sample.x1} × ${this.weights.w1.toFixed(2)} = ${(sample.x1 * this.weights.w1).toFixed(2)}</span>`;
            document.getElementById('mult2').innerHTML = 
                `x₂ × w₂ = <span class="highlight">${sample.x2} × ${this.weights.w2.toFixed(2)} = ${(sample.x2 * this.weights.w2).toFixed(2)}</span>`;
            
            this.highlightCalculationStep('step2');
        }, 200 / this.animationSpeed);
        
        setTimeout(() => {
            // Step 2: Weighted Sum
            const term1 = (sample.x1 * this.weights.w1).toFixed(2);
            const term2 = (sample.x2 * this.weights.w2).toFixed(2);
            const biasStr = this.weights.bias >= 0 ? `+${this.weights.bias.toFixed(2)}` : this.weights.bias.toFixed(2);
            
            document.getElementById('z-calc').innerHTML = 
                `z = <span class="highlight">${term1} + ${term2} ${biasStr}</span> = <span class="z-result">${z.toFixed(2)}</span>`;
            
            this.highlightCalculationStep('step3');
        }, 400 / this.animationSpeed);
        
        setTimeout(() => {
            // Step 3: Activation Function
            const comparison = z >= 0 ? '≥' : '&lt;';
            const reason = z >= 0 ? `since ${z.toFixed(2)} ≥ 0` : `since ${z.toFixed(2)} < 0`;
            
            document.getElementById('activation-calc').innerHTML = 
                `f(<span class="z-input">${z.toFixed(2)}</span>) = <span class="output-result">${output}</span>
                <span class="activation-reason">(${reason})</span>`;
            
            this.highlightCalculationStep('step4');
        }, 600 / this.animationSpeed);
        
        setTimeout(() => {
            // Step 4: Error Calculation
            document.getElementById('error-calc').innerHTML = 
                `Error = Target - Output = <span class="error-result">${sample.target} - ${output} = ${error}</span>`;
        }, 800 / this.animationSpeed);
    }
    
    animateWeightUpdate(oldWeights, newWeights) {
        setTimeout(() => {
            document.querySelector('.weight-change:nth-child(1)').innerHTML = 
                `w₁: <span class="old-weight">${oldWeights.w1.toFixed(3)}</span> → <span class="new-weight">${newWeights.w1.toFixed(3)}</span>`;
            document.querySelector('.weight-change:nth-child(2)').innerHTML = 
                `w₂: <span class="old-weight">${oldWeights.w2.toFixed(3)}</span> → <span class="new-weight">${newWeights.w2.toFixed(3)}</span>`;
            document.querySelector('.weight-change:nth-child(3)').innerHTML = 
                `bias: <span class="old-weight">${oldWeights.bias.toFixed(3)}</span> → <span class="new-weight">${newWeights.bias.toFixed(3)}</span>`;
        }, 1000 / this.animationSpeed);
    }
    
    highlightCalculationStep(stepId) {
        // Remove active class from all steps
        document.querySelectorAll('.calc-step').forEach(step => step.classList.remove('active'));
        
        // Add active class to current step
        document.getElementById(stepId)?.classList.add('active');
    }
    
    updateDisplays() {
        // Update current weights
        document.getElementById('weight1-display').textContent = this.weights.w1.toFixed(3);
        document.getElementById('weight2-display').textContent = this.weights.w2.toFixed(3);
        document.getElementById('bias-display').textContent = this.weights.bias.toFixed(3);
        
        // Update epoch and error count
        document.getElementById('current-epoch').textContent = this.epoch;
        
        const totalErrors = this.trainingData.reduce((sum, s) => sum + Math.abs(s.error), 0);
        document.getElementById('error-count').textContent = totalErrors;
        
        // Update progress bar
        const progress = this.epoch / this.maxEpochs * 100;
        document.getElementById('progress-fill').style.width = `${Math.min(progress, 100)}%`;
        
        if (totalErrors === 0) {
            document.getElementById('progress-text').textContent = 'Training completed successfully!';
        } else {
            document.getElementById('progress-text').textContent = `Epoch ${this.epoch}, ${totalErrors} errors remaining`;
        }
    }
    
    completeTraining(converged) {
        this.isTraining = false;
        this.isPaused = false;
        
        document.getElementById('start-training').disabled = false;
        
        if (converged) {
            document.getElementById('training-status').textContent = 'Converged';
            document.getElementById('training-status').className = 'status-converged';
            document.getElementById('progress-text').textContent = `Training completed in ${this.epoch} epochs!`;
        } else {
            document.getElementById('training-status').textContent = 'Max Epochs';
            document.getElementById('training-status').className = 'status-failed';
            document.getElementById('progress-text').textContent = `Max epochs (${this.maxEpochs}) reached`;
        }
        
        this.updateDisplays();
        this.updateDataTable();
    }
    
    drawDecisionBoundary() {
        const canvas = document.getElementById('decision-boundary-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set up coordinate system (margin of 40 pixels)
        const margin = 40;
        const plotWidth = width - 2 * margin;
        const plotHeight = height - 2 * margin;
        
        // Draw axes
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.moveTo(margin, height - margin);
        ctx.lineTo(margin, margin);
        ctx.stroke();
        
        // Draw axis labels
        ctx.fillStyle = '#374151';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('x₁', width - 20, height - 10);
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('x₂', 0, 0);
        ctx.restore();
        
        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const x = margin + (i / 5) * plotWidth;
            const y = height - margin - (i / 5) * plotHeight;
            
            ctx.beginPath();
            ctx.moveTo(x, height - margin);
            ctx.lineTo(x, margin);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(width - margin, y);
            ctx.stroke();
            
            // Add labels
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText((i / 5).toFixed(1), x, height - margin + 15);
            ctx.fillText((1 - i / 5).toFixed(1), margin - 15, y + 3);
        }
        
        // Draw decision boundary if weights are not all zero
        if (this.weights.w1 !== 0 || this.weights.w2 !== 0) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            // Decision boundary: w1*x1 + w2*x2 + bias = 0
            // Solve for x2: x2 = -(w1*x1 + bias) / w2
            if (Math.abs(this.weights.w2) > 0.001) {
                const x1_start = 0;
                const x1_end = 1;
                const x2_start = -(this.weights.w1 * x1_start + this.weights.bias) / this.weights.w2;
                const x2_end = -(this.weights.w1 * x1_end + this.weights.bias) / this.weights.w2;
                
                const canvasX1 = margin + x1_start * plotWidth;
                const canvasY1 = height - margin - x2_start * plotHeight;
                const canvasX2 = margin + x1_end * plotWidth;
                const canvasY2 = height - margin - x2_end * plotHeight;
                
                ctx.moveTo(canvasX1, canvasY1);
                ctx.lineTo(canvasX2, canvasY2);
            } else if (Math.abs(this.weights.w1) > 0.001) {
                // Vertical line: x1 = -bias/w1
                const x1_line = -this.weights.bias / this.weights.w1;
                if (x1_line >= 0 && x1_line <= 1) {
                    const canvasX = margin + x1_line * plotWidth;
                    ctx.moveTo(canvasX, margin);
                    ctx.lineTo(canvasX, height - margin);
                }
            }
            ctx.stroke();
        }
        
        // Draw training data points
        this.trainingData.forEach((sample, index) => {
            const canvasX = margin + sample.x1 * plotWidth;
            const canvasY = height - margin - sample.x2 * plotHeight;
            
            // Enhanced point styling with current sample highlighting
            const isCurrentSample = index === this.currentSampleIndex && this.isTraining;
            const pointSize = isCurrentSample ? 12 : 8;
            const glowSize = isCurrentSample ? 16 : 0;
            
            if (isCurrentSample) {
                // Draw glow effect
                ctx.fillStyle = sample.target === 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)';
                ctx.beginPath();
                ctx.arc(canvasX, canvasY, glowSize, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            ctx.fillStyle = sample.target === 0 ? '#ef4444' : '#10b981';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, pointSize, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add border
            ctx.strokeStyle = isCurrentSample ? '#fbbf24' : 'white';
            ctx.lineWidth = isCurrentSample ? 3 : 2;
            ctx.stroke();
            
            // Show sample number if it's the current sample
            if (isCurrentSample) {
                ctx.fillStyle = '#374151';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(`${index + 1}`, canvasX, canvasY - 20);
            }
        });
    }
    
    exportResults() {
        const results = {
            dataset: this.currentDataset,
            finalWeights: this.weights,
            epochs: this.epoch,
            learningRate: this.learningRate,
            trainingData: this.trainingData,
            converged: this.trainingData.every(s => s.error === 0)
        };
        
        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `perceptron_results_${this.currentDataset}_epoch${this.epoch}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    setupEnhancedAnimations() {
        this.learningAnimationSpeed = 1;
        this.advancedMode = false;
        
        // Initialize boundary stats update
        this.updateBoundaryStats();
        
        // Setup continuous boundary equation update
        this.boundaryUpdateInterval = setInterval(() => {
            this.updateBoundaryStats();
        }, 100);
    }
    
    updateBoundaryStats() {
        const equationElement = document.getElementById('current-boundary-eq');
        const slopeElement = document.getElementById('boundary-slope');
        const interceptElement = document.getElementById('boundary-intercept');
        
        if (equationElement) {
            equationElement.textContent = 
                `${this.weights.w1.toFixed(2)}x₁ + ${this.weights.w2.toFixed(2)}x₂ + ${this.weights.bias.toFixed(2)} = 0`;
        }
        
        if (slopeElement && Math.abs(this.weights.w2) > 0.001) {
            const slope = -this.weights.w1 / this.weights.w2;
            slopeElement.textContent = slope.toFixed(3);
        } else if (slopeElement) {
            slopeElement.textContent = 'undefined';
        }
        
        if (interceptElement && Math.abs(this.weights.w2) > 0.001) {
            const intercept = -this.weights.bias / this.weights.w2;
            interceptElement.textContent = intercept.toFixed(3);
        } else if (interceptElement) {
            interceptElement.textContent = 'undefined';
        }
    }
    
    animateLearningProcess() {
        // Animate learning explanation steps
        const steps = document.querySelectorAll('#learn-step-1, #learn-step-2, #learn-step-3, #learn-step-4');
        
        steps.forEach(step => step.classList.remove('animated'));
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('animated');
                step.classList.add('slide-in-animation');
                
                // Add visual feedback for each step
                const visual = step.querySelector('.step-visual > div');
                if (visual) {
                    visual.style.animationDelay = '0.3s';
                    visual.classList.add('pulse-animation');
                }
                
                setTimeout(() => {
                    step.classList.remove('slide-in-animation');
                    if (visual) {
                        visual.classList.remove('pulse-animation');
                    }
                }, 1000 / this.learningAnimationSpeed);
                
            }, (index * 800) / this.learningAnimationSpeed);
        });
    }
    
    toggleAdvancedMode() {
        this.advancedMode = !this.advancedMode;
        const button = document.getElementById('toggle-advanced-mode');
        
        if (this.advancedMode) {
            button.textContent = '🔬 Basic Mode';
            button.title = 'Switch to basic visualizations';
            this.enableAdvancedVisualizations();
        } else {
            button.textContent = '🔬 Advanced Mode';
            button.title = 'Toggle advanced visualizations';
            this.disableAdvancedVisualizations();
        }
    }
    
    enableAdvancedVisualizations() {
        // Add advanced visual effects to training
        const canvas = document.getElementById('decision-boundary-canvas');
        if (canvas) {
            canvas.classList.add('glow-animation');
        }
        
        // Enable enhanced boundary overlay
        const overlay = document.getElementById('boundary-overlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
    }
    
    disableAdvancedVisualizations() {
        // Remove advanced visual effects
        const canvas = document.getElementById('decision-boundary-canvas');
        if (canvas) {
            canvas.classList.remove('glow-animation');
        }
        
        // Disable enhanced boundary overlay
        const overlay = document.getElementById('boundary-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
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

// Enhanced Perceptron Demo Class (keeping for backward compatibility)
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

// Function Builder Class for visualizing function construction
class FunctionBuilder {
    constructor() {
        this.currentStep = 0;
        this.animationRunning = false;
        this.setupCanvases();
    }
    
    setupCanvases() {
        // Initialize canvases for function visualization
        setTimeout(() => {
            this.drawLinearFunction();
            this.drawThresholdFunction();
            this.drawCompleteFunction();
        }, 100);
    }
    
    drawLinearFunction() {
        const canvas = document.getElementById('linear-function-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw 3D-like representation of linear combination
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        
        // Draw axes
        ctx.beginPath();
        ctx.moveTo(20, canvas.height - 20);
        ctx.lineTo(canvas.width - 20, canvas.height - 20);
        ctx.moveTo(20, canvas.height - 20);
        ctx.lineTo(20, 20);
        ctx.stroke();
        
        // Draw linear combination surface (simplified)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, canvas.height - 30);
        ctx.lineTo(canvas.width - 30, 30);
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#374151';
        ctx.font = '10px Inter';
        ctx.fillText('w₁x₁ + w₂x₂ + b', canvas.width / 2 - 30, canvas.height - 5);
    }
    
    drawThresholdFunction() {
        const canvas = document.getElementById('threshold-function-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw step function
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        // Left side (output = 0)
        ctx.moveTo(20, canvas.height - 30);
        ctx.lineTo(canvas.width / 2, canvas.height - 30);
        
        // Right side (output = 1)
        ctx.moveTo(canvas.width / 2, 30);
        ctx.lineTo(canvas.width - 20, 30);
        ctx.stroke();
        
        // Vertical line at threshold
        ctx.strokeStyle = '#6b7280';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 30);
        ctx.lineTo(canvas.width / 2, canvas.height - 30);
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#374151';
        ctx.font = '10px Inter';
        ctx.fillText('0', 30, canvas.height - 10);
        ctx.fillText('1', canvas.width - 30, canvas.height - 10);
        ctx.fillText('threshold', canvas.width / 2 - 20, canvas.height - 5);
    }
    
    drawCompleteFunction() {
        const canvas = document.getElementById('complete-function-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw decision boundary visualization
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(20, canvas.height / 2, canvas.width / 2 - 20, canvas.height / 2 - 20);
        
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.fillRect(canvas.width / 2, 20, canvas.width / 2 - 20, canvas.height / 2);
        
        // Draw boundary line
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(canvas.width - 20, canvas.height - 20);
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#374151';
        ctx.font = '10px Inter';
        ctx.fillText('Class 0', 30, canvas.height - 30);
        ctx.fillText('Class 1', canvas.width - 60, 40);
    }
    
    animateFunctionBuilding() {
        if (this.animationRunning) return;
        
        this.animationRunning = true;
        const steps = document.querySelectorAll('.function-step');
        
        // Reset all steps
        steps.forEach(step => step.classList.remove('animated'));
        
        // Animate each step
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('animated');
                step.classList.add('pulse-animation');
                
                setTimeout(() => {
                    step.classList.remove('pulse-animation');
                }, 800);
                
                if (index === steps.length - 1) {
                    setTimeout(() => {
                        this.animationRunning = false;
                    }, 800);
                }
            }, index * 600);
        });
    }
    
    resetAnimation() {
        const steps = document.querySelectorAll('.function-step');
        steps.forEach(step => {
            step.classList.remove('animated', 'pulse-animation');
        });
        this.animationRunning = false;
    }
}

// Enhanced Perceptron Diagram Class
class EnhancedPerceptronDiagram {
    constructor() {
        this.setupCanvas();
        this.dataFlowActive = false;
    }
    
    setupCanvas() {
        const canvas = document.getElementById('enhanced-perceptron-canvas');
        if (!canvas) return;
        
        // Draw enhanced perceptron diagram
        setTimeout(() => {
            this.drawEnhancedDiagram();
        }, 100);
    }
    
    drawEnhancedDiagram() {
        const canvas = document.getElementById('enhanced-perceptron-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Input layer
        const inputPositions = [
            { x: 100, y: 150, label: 'x₁', value: '0.8' },
            { x: 100, y: 250, label: 'x₂', value: '0.6' },
            { x: 100, y: 350, label: 'bias', value: '1.0' }
        ];
        
        // Draw input nodes
        inputPositions.forEach((pos, index) => {
            // Node circle
            ctx.fillStyle = index === 2 ? '#ef4444' : '#3b82f6';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
            ctx.fill();
            
            // Node border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Node label
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(pos.label, pos.x, pos.y + 5);
            
            // Value label
            ctx.fillStyle = '#374151';
            ctx.font = '12px Inter';
            ctx.fillText(pos.value, pos.x, pos.y + 45);
        });
        
        // Weight connections
        const weights = ['0.5', '-0.3', '0.2'];
        inputPositions.forEach((pos, index) => {
            const targetX = 350;
            const targetY = 250;
            
            // Connection line
            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(pos.x + 25, pos.y);
            ctx.lineTo(targetX - 40, targetY);
            ctx.stroke();
            
            // Weight label
            const midX = (pos.x + 25 + targetX - 40) / 2;
            const midY = (pos.y + targetY) / 2;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(midX - 15, midY - 10, 30, 20);
            
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(midX - 15, midY - 10, 30, 20);
            
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(weights[index], midX, midY + 4);
        });
        
        // Processing node (neuron)
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(350, 250, 40, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Sigma symbol
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Σ', 350, 255);
        
        // Activation function
        ctx.font = 'bold 12px Inter';
        ctx.fillText('f', 350, 275);
        
        // Output connection
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(390, 250);
        ctx.lineTo(500, 250);
        ctx.stroke();
        
        // Arrow
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.moveTo(500, 250);
        ctx.lineTo(485, 240);
        ctx.lineTo(485, 260);
        ctx.closePath();
        ctx.fill();
        
        // Output node
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(520, 250, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('1', 520, 255);
        
        // Function labels
        ctx.fillStyle = '#374151';
        ctx.font = '14px Inter';
        ctx.fillText('Inputs', 100, 120);
        ctx.fillText('Weights', 220, 180);
        ctx.fillText('Sum + Activation', 350, 320);
        ctx.fillText('Output', 520, 220);
    }
    
    animateDataFlow() {
        if (this.dataFlowActive) return;
        
        this.dataFlowActive = true;
        const canvas = document.getElementById('enhanced-perceptron-canvas');
        if (!canvas) return;
        
        // Add flowing particles animation
        this.drawFlowingParticles();
        
        setTimeout(() => {
            this.dataFlowActive = false;
        }, 3000);
    }
    
    drawFlowingParticles() {
        const canvas = document.getElementById('enhanced-perceptron-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // Create particles at input positions
        const inputPositions = [150, 250, 350];
        inputPositions.forEach(y => {
            particles.push({
                x: 125,
                y: y,
                targetX: 310,
                targetY: 250,
                progress: 0,
                speed: 0.02 + Math.random() * 0.01
            });
        });
        
        const animateParticles = () => {
            // Redraw the base diagram
            this.drawEnhancedDiagram();
            
            // Draw and update particles
            particles.forEach(particle => {
                particle.progress += particle.speed;
                
                if (particle.progress <= 1) {
                    const currentX = particle.x + (particle.targetX - particle.x) * particle.progress;
                    const currentY = particle.y + (particle.targetY - particle.y) * particle.progress;
                    
                    // Draw particle
                    ctx.fillStyle = '#fbbf24';
                    ctx.beginPath();
                    ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
            
            if (particles.some(p => p.progress < 1) && this.dataFlowActive) {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
    }
    
    showLiveCalculations() {
        // Highlight calculation steps in the live calculations section
        const calcSteps = document.querySelectorAll('.calc-step');
        
        calcSteps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('glow-animation');
                
                setTimeout(() => {
                    step.classList.remove('glow-animation');
                }, 1000);
            }, index * 500);
        });
    }
}

// Boundary Visualizer Class
class BoundaryVisualizer {
    constructor() {
        this.setupVisualization();
    }
    
    setupVisualization() {
        // Enhanced boundary visualization setup
        setTimeout(() => {
            this.initializeOverlay();
        }, 100);
    }
    
    initializeOverlay() {
        const overlay = document.getElementById('boundary-overlay');
        if (overlay) {
            overlay.style.display = 'none'; // Hidden by default, shown in advanced mode
        }
    }
}

// Initialize training simulator
let trainingSimulator = null;

// Logo click handler
document.getElementById('app-logo').addEventListener('click', () => {
    // Reset to first page
    navItems.forEach(nav => nav.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    
    document.querySelector('[data-page="perceptron"]').classList.add('active');
    document.getElementById('perceptron-page').classList.add('active');
});