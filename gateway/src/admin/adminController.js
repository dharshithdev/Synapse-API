const Service = require('../models/Service');

// 1. Get all registered services for the dashboard table
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard services." });
    }
};

// 2. Add a brand new microservice dynamically (+ Add Service button)
const registerService = async (req, res) => {
    try {
        const { name, apiPrefix, targetUrl } = req.body;
        if (!name || !apiPrefix || !targetUrl) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newService = new Service({ name, apiPrefix, targetUrl });
        await newService.save();
        res.status(201).json({ message: `Service '${name}' registered!`, service: newService });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ error: "Prefix already exists." });
        res.status(500).json({ error: "Registration failed." });
    }
};

// 3. Update service configurations or toggle isActive state
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Service.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Service not found" });
        res.status(200).json({ message: "Configuration updated successfully!", service: updated });
    } catch (error) {
        res.status(500).json({ error: "Update failed." });
    }
};

// 4. Delete a microservice configuration permanently
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Service.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Service not found" });
        res.status(200).json({ message: `Service '${deleted.name}' removed.` });
    } catch (error) {
        res.status(500).json({ error: "Deletion failed." });
    }
};

module.exports = { getAllServices, registerService, updateService, deleteService };