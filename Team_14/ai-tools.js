// Initialize Charts
document.addEventListener('DOMContentLoaded', () => {
    // Audience Chart
    const audienceCtx = document.getElementById('audienceChart').getContext('2d');
    new Chart(audienceCtx, {
        type: 'doughnut',
        data: {
            labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
            datasets: [{
                data: [15, 35, 25, 15, 10],
                backgroundColor: [
                    '#2563eb',
                    '#1e40af',
                    '#3b82f6',
                    '#60a5fa',
                    '#93c5fd'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Budget Chart
    const budgetCtx = document.getElementById('budgetChart').getContext('2d');
    new Chart(budgetCtx, {
        type: 'bar',
        data: {
            labels: ['Facebook', 'Instagram', 'Google Ads', 'LinkedIn', 'Twitter'],
            datasets: [{
                label: 'Budget Allocation',
                data: [40, 25, 20, 10, 5],
                backgroundColor: '#2563eb',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '$' + value
                    }
                }
            }
        }
    });
});

// AI Content Generator
const generateContentBtn = document.getElementById('generateContent');
const generatedContentDiv = document.getElementById('generatedContent');

generateContentBtn.addEventListener('click', async () => {
    const product = document.getElementById('product').value;
    const target = document.getElementById('target').value;
    const tone = document.getElementById('tone').value;

    if (!product || !target) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading state
    generateContentBtn.disabled = true;
    generateContentBtn.textContent = 'Generating...';
    generatedContentDiv.innerHTML = '<div class="loading">Generating content...</div>';

    try {
        // Simulate API call to AI service
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate content based on inputs
        const content = generateAIContent(product, target, tone);
        
        // Display generated content
        generatedContentDiv.innerHTML = `
            <div class="content-section">
                <h4>Ad Headline</h4>
                <p>${content.headline}</p>
            </div>
            <div class="content-section">
                <h4>Ad Description</h4>
                <p>${content.description}</p>
            </div>
            <div class="content-section">
                <h4>Call to Action</h4>
                <p>${content.cta}</p>
            </div>
            <div class="content-section">
                <h4>Hashtags</h4>
                <p>${content.hashtags}</p>
            </div>
        `;
    } catch (error) {
        generatedContentDiv.innerHTML = '<div class="error">Error generating content. Please try again.</div>';
    } finally {
        generateContentBtn.disabled = false;
        generateContentBtn.textContent = 'Generate Ad Content';
    }
});

// AI Content Generation Logic
function generateAIContent(product, target, tone) {
    // This is a simplified version. In a real application, this would call an AI API
    const headlines = {
        professional: [
            `Transform Your Business with ${product}`,
            `Elevate Your Success with ${product}`,
            `Professional ${product} Solutions for Modern Businesses`
        ],
        casual: [
            `Make Life Easier with ${product}`,
            `Your Perfect ${product} Solution`,
            `Love What You Do with ${product}`
        ],
        friendly: [
            `Hey! Meet Your New Favorite ${product}`,
            `Welcome to the Future of ${product}`,
            `Your Journey to Better ${product} Starts Here`
        ]
    };

    const descriptions = {
        professional: [
            `Streamline your operations and boost productivity with our professional ${product} solution. Perfect for ${target}.`,
            `Experience the power of efficient ${product} management. Designed specifically for ${target}.`,
            `Take your business to the next level with our comprehensive ${product} platform.`
        ],
        casual: [
            `Say goodbye to hassle with our easy-to-use ${product}. Perfect for ${target}!`,
            `Get more done with less stress using ${product}. Made for ${target}.`,
            `Simplify your life with ${product}. The smart choice for ${target}.`
        ],
        friendly: [
            `Hey there! We've got something special for you - our amazing ${product}! Perfect for ${target}.`,
            `Looking for a better way? Meet ${product}, your new best friend for ${target}!`,
            `We're excited to introduce ${product}, the perfect solution for ${target}.`
        ]
    };

    const ctas = {
        professional: [
            'Get Started Today',
            'Schedule a Demo',
            'Learn More'
        ],
        casual: [
            'Try It Now',
            'Give It a Shot',
            'Get Started'
        ],
        friendly: [
            'Join Us Today!',
            'Let\'s Get Started!',
            'Come On In!'
        ]
    };

    const hashtags = {
        professional: [
            '#BusinessGrowth',
            '#Professional',
            '#Innovation',
            '#Success'
        ],
        casual: [
            '#EasyLife',
            '#Simple',
            '#Better',
            '#Modern'
        ],
        friendly: [
            '#Hello',
            '#Welcome',
            '#Friendly',
            '#Community'
        ]
    };

    const randomIndex = Math.floor(Math.random() * 3);

    return {
        headline: headlines[tone][randomIndex],
        description: descriptions[tone][randomIndex],
        cta: ctas[tone][randomIndex],
        hashtags: hashtags[tone].join(' ')
    };
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 