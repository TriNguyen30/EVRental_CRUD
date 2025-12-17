// controllers/riskController.js
const { AppDataSource } = require("../config/database");

const renterRepo = AppDataSource.getRepository("Renter");
const reportRepo = AppDataSource.getRepository("Report");

const getRiskyRenters = async (req, res) => {
    try {
        const riskData = await reportRepo
            .createQueryBuilder("r")
            .select("r.RenterID")
            .addSelect("COUNT(*)", "totalReports")
            .addSelect("SUM(CASE WHEN r.IsHighRisk = true THEN 1 ELSE 0 END)", "highRiskCount")
            .where("r.RenterID IS NOT NULL")
            .groupBy("r.RenterID")
            .having("COUNT(*) >= 2 OR SUM(CASE WHEN r.IsHighRisk = true THEN 1 ELSE 0 END) >= 1")
            .getRawMany();

        const renterIds = riskData.map(r => r.RenterID);
        if (renterIds.length === 0) return res.json({ data: [], total: 0 });

        const renters = await renterRepo
            .createQueryBuilder("rent")
            .leftJoinAndSelect("rent.Account", "a")
            .where("rent.RenterID IN (:...ids)", { ids: renterIds })
            .getMany();

        const enriched = renters.map(rent => {
            const stats = riskData.find(d => d.RenterID === rent.RenterID);
            return {
                RenterID: rent.RenterID,
                FullName: rent.Account?.FullName || "Unknown",
                Email: rent.Account?.Email || "N/A",
                TotalReports: parseInt(stats.totalReports),
                HighRiskReports: parseInt(stats.highRiskCount),
                RiskLevel: parseInt(stats.highRiskCount) > 0 ? "High" : parseInt(stats.totalReports) >= 3 ? "Medium" : "Low",
            };
        }).sort((a, b) => b.TotalReports - a.TotalReports);

        res.json({ data: enriched, total: enriched.length });
    } catch (err) {
        console.error("getRiskyRenters error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getRiskyRenters };