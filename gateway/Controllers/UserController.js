const Service = require('../Models/Service');
const protect = require('../Middleware/Protect'); // Token verification middleware
const Analytics = require("../Models/Analytics");
const mongoose = require('mongoose');

const crypto = require('crypto');
// @desc    Get all active service mappings for authenticated tenant
// @route   GET /api/dashboard-mgmt/services
const getServices = async (req, res) => {
    try {
        const services = await Service.find({ userId: req.user.id });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving your configurations', error: error.message });
    }
};

// @desc    Provision new gateway proxy path mapping
// @route   POST /api/dashboard-mgmt/services
const addService = async (req, res) => {
    console.log('Add');
    try {
        const { name, frontendPath, targetUrl, rateLimit } = req.body;
        const secureApiKey = `synapse_live_${crypto.randomBytes(32).toString('hex')}`;
        // Check if routing intercept already exists globally
        const absolutePath = frontendPath.startsWith('/') ? frontendPath : `/${frontendPath}`;
        const pathConflict = await Service.findOne({ frontendPath: absolutePath });
        
        if (pathConflict) {
            return res.status(400).json({ message: 'This proxy entry path is already reserved globally.' });
        }

        const service = await Service.create({
            userId: req.user.id, // Linked via Identity map token population
            name,
            frontendPath: absolutePath,
            targetUrl,
            rateLimit: rateLimit || 60,
            apiKey: secureApiKey // Injection on backend side
        });

        res.status(201).json(service);
    } catch (error) {
        console.log(error.message, error);
        res.status(500).json({ message: 'Error establishing provisioning engine', error: error.message });
    }
};

// @desc    Update service rule configuration details
// @route   PUT /api/dashboard-mgmt/services/:id
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, targetUrl, rateLimit } = req.body;

        // Find the service and update it with the new settings
        const updatedService = await Service.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    name, 
                    targetUrl, 
                    rateLimit: parseInt(rateLimit) || 60 
                } 
            },
            { new: true, runValidators: true } // Return the freshly modified document
        );

        if (!updatedService) {
            return res.status(404).json({ message: 'Target proxy cluster configuration not found.' });
        }

        res.status(200).json(updatedService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to rewrite cluster configuration node details.', error: err.message });
    }
};

// @desc    De-provision and delete gateway cluster path
// @route   DELETE /api/dashboard-mgmt/services/:id
const deleteService = async (req, res) => {
    try {
        const service = await Service.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!service) return res.status(404).json({ message: 'Proxy configuration not found or unauthorized' });

        res.status(200).json({ message: 'Routing cluster cleared from infrastructure gateway.' });
    } catch (error) {
        res.status(500).json({ message: 'De-provisioning lifecycle failure', error: error.message });
    }
};

// GET single service cluster configuration detail mapping
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ObjectId structure before hitting MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid cluster identification signature.' });
        }

        const service = await Service.findById(id); 
        
        if (!service) {
            return res.status(404).json({ message: 'Target proxy cluster configuration not found.' });
        }

        // Set the analytics timeline window (e.g., past 24 hours)
        const timeWindow = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // --- MONGODB AGGREGATION PIPELINE FOR REAL telemetry METRICS ---
        const metrics = await Analytics.aggregate([
            {
                $match: {
                    serviceId: new mongoose.Types.ObjectId(id),
                    timestamp: { $gte: timeWindow }
                }
            },
            {
                $facet: {
                    // Pipeline 1: Calculate global averages (Latency and Error Rate)
                    globalStats: [
                        {
                            $group: {
                                _id: null,
                                avgLatency: { $avg: '$responseTime' },
                                totalRequests: { $sum: 1 },
                                errorRequests: {
                                    $sum: {
                                        $cond: [{ $gte: ['$statusCode', 400] }, 1, 0]
                                    }
                                }
                            }
                        }
                    ],
                    // Pipeline 2: Group counts into hourly intervals for the dashboard chart
                    chartTimeline: [
                        {
                            $group: {
                                _id: { $hour: '$timestamp' },
                                count: { $sum: 1 },
                                rawTime: { $first: '$timestamp' }
                            }
                        },
                        { $sort: { rawTime: 1 } } // Sort chronologically
                    ]
                }
            }
        ]);

        // Extract and format the aggregation results safely
        const stats = metrics[0]?.globalStats[0] || { avgLatency: 0, totalRequests: 0, errorRequests: 0 };
        const timeline = metrics[0]?.chartTimeline || [];

        // Compute real percentage rates
        const computedErrorRate = stats.totalRequests > 0 
            ? parseFloat(((stats.errorRequests / stats.totalRequests) * 100).toFixed(2)) 
            : 0;

        // Map the database timeline array into a clean array of values for your React Chart component
        const requestsOverTime = timeline.map(item => item.count);
        
        // Fallback placeholder formatting if your chart requires standard structural array padding
        const finalChartData = requestsOverTime.length > 0 ? requestsOverTime : [0, 0, 0, 0, 0, 0, 0];

        const realAnalytics = {
            requestsOverTime: finalChartData,
            errorRate: computedErrorRate, // Dynamic true percentage (e.g., 2.5)
            latency: `${Math.round(stats.avgLatency)}ms`, // Real dynamic latency (e.g., "45ms")
            activeConnections: Math.floor(Math.random() * 5) + 1, // Keep simulated socket weight or leave empty
            apiKey: service.apiKey || "NULL"
        };

        res.status(200).json({ service, analytics: realAnalytics });

    } catch (err) {
        console.error('❌ Controller Telemetry Aggregation Error:', err);
        res.status(500).json({ message: 'Error parsing telemetry map from cluster node.', error: err.message });
    }
};

const getGlobalMetrics = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from your JWT auth middleware
        
        // 1. Fetch all active services owned by this authenticated user
        const userServices = await Service.find({ userId });
        const serviceIds = userServices.map(s => s._id);

        if (serviceIds.length === 0) {
            return res.status(200).json({
                totalRequests: 0,
                successRate: 100,
                activeServices: 0,
                avgLatency: 0,
                trafficData: [],
                statusDist: [],
                servicePerformance: []
            });
        }

        const timeWindow = new Date(Date.now() - 24 * 60 * 60 * 1000); // Past 24 hours

        // 2. Perform global infrastructure aggregations via parallel facets
        const aggregationResult = await Analytics.aggregate([
            {
                $match: {
                    serviceId: { $in: serviceIds },
                    timestamp: { $gte: timeWindow }
                }
            },
            {
                $facet: {
                    // Headline Metrics Overview
                    overviewStats: [
                        {
                            $group: {
                                _id: null,
                                totalRequests: { $sum: 1 },
                                avgLatency: { $avg: '$responseTime' },
                                successRequests: {
                                    $sum: { $cond: [{ $lt: ['$statusCode', 400] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    // Timeline data for the Recharts Area Chart
                    timelineCharts: [
                        {
                            $group: {
                                _id: { $hour: '$timestamp' },
                                requests: { $sum: 1 },
                                rawTime: { $first: '$timestamp' }
                            }
                        },
                        { $sort: { rawTime: 1 } }
                    ],
                    // Breakdown group arrays for the Pie Chart
                    statusCodeDistribution: [
                        {
                            $group: {
                                _id: {
                                    $cond: [
                                        { $lt: ['$statusCode', 300] }, '200 OK',
                                        { $cond: [{ $eq: ['$statusCode', 429] }, '429 Rate Limit', 'Error / Other'] }
                                    ]
                                },
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    // Performance breakdown per individual service
                    serviceBreakdown: [
                        {
                            $group: {
                                _id: '$serviceId',
                                avgLatency: { $avg: '$responseTime' }
                            }
                        }
                    ]
                }
            }
        ]);

        const rawOverview = aggregationResult[0]?.overviewStats[0] || { totalRequests: 0, avgLatency: 0, successRequests: 0 };
        const rawTimeline = aggregationResult[0]?.timelineCharts || [];
        const rawDistribution = aggregationResult[0]?.statusCodeDistribution || [];
        const rawBreakdown = aggregationResult[0]?.serviceBreakdown || [];

        // 3. Post-Process Data Formats cleanly for the frontend charts
        const successRate = rawOverview.totalRequests > 0 
            ? parseFloat(((rawOverview.successRequests / rawOverview.totalRequests) * 100).toFixed(1)) 
            : 100;

        // Map Recharts Area Chart variables
        const trafficData = rawTimeline.map(item => ({
            time: `${item._id}:00`,
            requests: item.requests
        }));

        // Map Recharts Pie Chart status colors
        const colorPalette = { '200 OK': '#8b5cf6', '429 Rate Limit': '#f43f5e', 'Error / Other': '#3b82f6' };
        const statusDist = rawDistribution.map(item => ({
            name: item._id,
            value: rawOverview.totalRequests > 0 ? parseFloat(((item.count / rawOverview.totalRequests) * 100).toFixed(0)) : 0,
            color: colorPalette[item._id] || '#6b7280'
        }));

        // Map Service list performance rows
        const servicePerformance = rawBreakdown.map(b => {
            const matchedService = userServices.find(s => s._id.toString() === b._id.toString());
            return {
                id: b._id,
                name: matchedService ? matchedService.name : 'Unknown Cluster',
                frontendPath: matchedService ? matchedService.frontendPath : '/api',
                avgLatency: Math.round(b.avgLatency)
            };
        });

        res.status(200).json({
            totalRequests: rawOverview.totalRequests,
            successRate,
            activeServices: userServices.filter(s => s.isActive).length,
            avgLatency: Math.round(rawOverview.avgLatency),
            trafficData,
            statusDist,
            servicePerformance
        });

    } catch (err) {
        console.error('❌ Global Telemetry Aggregation Failure:', err);
        res.status(500).json({ message: 'Internal Server Error computing system statistics cluster nodes.', error: err.message });
    }
};

module.exports = {getServices, addService, updateService, deleteService, getServiceById, getGlobalMetrics};