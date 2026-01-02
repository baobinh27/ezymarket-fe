import axiosInstance from "@/services/axios";
import { ReportOverview } from "@/types/types";

export const getReportOverview = (): Promise<ReportOverview> => {
    return axiosInstance.get('/api/reports/overview');
}