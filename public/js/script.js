// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    
    const typeIcons = {
        success: 'ri-checkbox-circle-fill',
        error: 'ri-error-warning-fill',
        info: 'ri-information-fill',
        warning: 'ri-alert-fill'
    };
    
    const typeColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `flex items-center p-4 w-80 ${typeColors[type]} text-white shadow-lg transform transition-transform duration-300 translate-x-full`;
    
    toast.innerHTML = `
        <i class="${typeIcons[type]} text-xl mr-3"></i>
        <span class="flex-grow">${message}</span>
        <button onclick="document.getElementById('${toastId}').remove()" class="ml-2">
            <i class="ri-close-line"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.getElementById(toastId)) {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.getElementById(toastId)) {
                    document.getElementById(toastId).remove();
                }
            }, 300);
        }
    }, 5000);
}

// Global variables
let currentTaskId = null;
let progressInterval = null;

// Refresh proxies
document.getElementById('refreshProxies').addEventListener('click', async function() {
    try {
        const response = await fetch('/api/refresh-proxies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message, 'success');
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Failed to refresh proxies', 'error');
    }
});

// Main functionality
document.getElementById('submitBtn').addEventListener('click', async function() {
    const url = document.getElementById('url').value;
    const views = parseInt(document.getElementById('views').value);
    
    // Validation
    if (!url) {
        showToast('Please enter a valid URL', 'error');
        return;
    }
    
    if (!views || views < 1 || views > 10000) {
        showToast('Please enter a valid number of views (1-10000)', 'error');
        return;
    }
    
    // Generate unique task ID
    currentTaskId = 'task_' + Date.now();
    
    // Show processing section
    document.getElementById('processingSection').classList.remove('hidden');
    document.getElementById('successSection').classList.add('hidden');
    document.getElementById('submitBtn').classList.add('hidden');
    document.getElementById('stopBtn').classList.remove('hidden');
    
    // Update progress text
    document.getElementById('progressText').textContent = `0/${views}`;
    
    try {
        const response = await fetch('/api/generate-visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                views: views,
                taskId: currentTaskId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Visitor generation started!', 'success');
            
            // Start progress tracking
            startProgressTracking(currentTaskId, views);
        } else {
            showToast(data.message, 'error');
            resetUI();
        }
    } catch (error) {
        showToast('Failed to start visitor generation', 'error');
        resetUI();
    }
});

// Stop functionality
document.getElementById('stopBtn').addEventListener('click', async function() {
    if (!currentTaskId) return;
    
    try {
        const response = await fetch(`/api/stop-task/${currentTaskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Visitor generation stopped', 'warning');
            resetUI();
        }
    } catch (error) {
        showToast('Failed to stop generation', 'error');
    }
});

// Progress tracking
function startProgressTracking(taskId, totalViews) {
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    progressInterval = setInterval(async () => {
        try {
            const response = await fetch(`/api/task-progress/${taskId}`);
            const data = await response.json();
            
            if (data.success) {
                const completed = data.completed;
                const percentage = data.percentage;
                
                // Update progress bar
                document.getElementById('progressBar').style.width = `${percentage}%`;
                document.getElementById('progressText').textContent = `${completed}/${totalViews}`;
                
                // Update status text
                const statusMessages = [
                    'Routing through proxy network...',
                    'Establishing secure connections...',
                    'Simulating user behavior...',
                    'Rotating IP addresses...',
                    'Bypassing security checks...',
                    'Optimizing delivery speed...'
                ];
                
                if (Math.random() > 0.8) {
                    document.getElementById('statusText').textContent = 
                        statusMessages[Math.floor(Math.random() * statusMessages.length)];
                }
                
                // Check if completed
                if (completed >= totalViews) {
                    clearInterval(progressInterval);
                    showSuccess(totalViews, document.getElementById('url').value);
                }
            } else {
                clearInterval(progressInterval);
                showToast('Task not found', 'error');
                resetUI();
            }
        } catch (error) {
            console.error('Progress check error:', error);
        }
    }, 2000);
}

// Show success
function showSuccess(views, url) {
    document.getElementById('processingSection').classList.add('hidden');
    document.getElementById('successSection').classList.remove('hidden');
    document.getElementById('successMessage').textContent = 
        `Successfully generated ${views} visitors to ${url}`;
    
    resetUI();
    showToast(`Successfully sent ${views} visitors!`, 'success');
}

// Reset UI
function resetUI() {
    document.getElementById('submitBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
    document.getElementById('progressBar').style.width = '0%';
    
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    
    currentTaskId = null;
}
