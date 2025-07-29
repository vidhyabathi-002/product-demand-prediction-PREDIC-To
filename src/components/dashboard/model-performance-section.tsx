
import { getModelPerformance } from "@/ai/flows/get-model-performance";
import { ModelPerformanceChart } from "@/components/external-data/model-performance-chart";

export async function ModelPerformanceSection() {
    const modelPerformance = await getModelPerformance();

    return <ModelPerformanceChart data={modelPerformance} />
}
