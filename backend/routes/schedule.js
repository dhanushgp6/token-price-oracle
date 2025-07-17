const express = require('express');
const router = express.Router();
const queueService = require('../services/queue');

// POST /api/schedule - Schedule full history fetch
router.post('/', async (req, res) => {
    try {
        const { token, network } = req.body;
        
        if (!token || !network) {
            return res.status(400).json({
                error: 'Missing required parameters: token, network'
            });
        }

        // Validate network
        if (!['ethereum', 'polygon'].includes(network)) {
            return res.status(400).json({
                error: 'Invalid network. Must be ethereum or polygon'
            });
        }

        // Schedule the job
        const jobId = await queueService.scheduleHistoryFetch(token, network);

        res.json({
            success: true,
            message: 'History fetch scheduled successfully',
            jobId,
            token,
            network,
            estimatedDuration: '5-10 minutes'
        });

    } catch (error) {
        console.error('❌ Schedule error:', error);
        res.status(500).json({ 
            error: 'Failed to schedule history fetch',
            details: error.message 
        });
    }
});

// GET /api/schedule/status/:jobId - Check job status
router.get('/status/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Get job status from queue
        const job = await queueService.priceQueue.getJob(jobId);
        
        if (!job) {
            return res.status(404).json({
                error: 'Job not found'
            });
        }

        res.json({
            jobId,
            status: await job.getState(),
            progress: job.progress,
            data: job.data,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to get job status',
            details: error.message 
        });
    }
});

module.exports = router;
