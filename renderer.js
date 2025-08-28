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

// Logo click handler
document.getElementById('app-logo').addEventListener('click', () => {
    // Reset to first page
    navItems.forEach(nav => nav.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    
    document.querySelector('[data-page="perceptron"]').classList.add('active');
    document.getElementById('perceptron-page').classList.add('active');
});