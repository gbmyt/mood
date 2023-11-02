import HistoryChart from "@/components/HistoryChart"
import { getUserByClerkId } from "@/utils/auth"
import { prisma } from "@/utils/db"

const getData = async () => {
    const user = await getUserByClerkId()
    const analyses = await prisma.analysis.findMany({
        where: {
            userId: user.id,
        },
    })
    const sum = analyses.reduce(
        (all, current) => all + current.sentimentScore,
        0
    )
    const average = Math.round(sum / analyses.length)
    return { analyses, average }
}

const HistoryPage = async () => {
    const { average, analyses } = await getData()
    console.log("Analyses here:", analyses)
    return (
        <div className="h-full w-full">
            <div>Average Sentiment</div>
            <div className="w-full h-full">
                <HistoryChart data={analyses} />
            </div>
        </div>
    )
}
export default HistoryPage
