import { getAuthorStatsService } from "../service/statsService.js";

export const getAuthorStats = async (req, res) => {
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const stats = await getAuthorStatsService(req.user.id, month, year);
  res.status(200).json({ success: true, data: stats });
};