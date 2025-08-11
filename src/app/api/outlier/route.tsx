import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { calculateIQR } from "@/lib/utils";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&&maxResults=20&key=`+process.env.YOUTUBE_API_KEY)
    const searchData = result.data;
    const videoIDs = searchData.items.map((item: any) => item.id.videoId).join(',');
    console.log('ids', videoIDs);

    // get youtub video details by ids
    const videoDetails = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIDs}&key=` + process.env.YOUTUBE_API_KEY);

    const videoResultData  = videoDetails.data;
    const videos = videoResultData.items.map((item: any) => {
        const today = new Date();
        const viewCount = parseInt(item.statistics.viewCount || "0");
        const likeCount = parseInt(item.statistics.likeCount || "0");
        const commentCount = parseInt(item.statistics.commentCount || "0");

        const publishDate = new Date(item.snippet.publishedAt);
        const daysSincePublished = Math.max((today.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24), 1);
        const viewsPerDay = viewCount / daysSincePublished;
        const engagementRate = ((likeCount + commentCount) / viewCount) * 100; // in %



        return{
            id: item.id,
            title: item.snippet.title,
            thumbnail:item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishAt: item.snippet.publishedAt,
            viewCount:item.statistics.viewCount,
            likeCount:item.statistics.likeCount,
            commentCount:item.statistics.commentCount,
            viewsPerDay,
            engagementRate
        }
    })

    const viewCounts = videos.map((v:any) => v.viewCount);
    const { iqr, lowerBound, upperBound } = calculateIQR(viewCounts);
    const avgViews = viewCounts.reduce((a:any, b:any) => a + b, 0) / viewCounts.length;
    const maxViewsPerDay = Math.max(...videos.map((v:any) => v.viewsPerDay));
    const maxEngagementRate = Math.max(...videos.map((v:any) => v.engagementRate));

    const finalResult = videos.map((v:any) => {
        const isOutlier = v.viewCount < lowerBound || v.viewCount > upperBound;
        let outlierScore = 0;
        if (isOutlier && iqr > 0) {
            if (v.viewCount > upperBound) {
            outlierScore = (v.viewCount - upperBound) / iqr;
            } else if (v.viewCount < lowerBound) {
            outlierScore = (lowerBound - v.viewCount) / iqr;
        }
    }
    const smartScore =
        (v.viewCount / avgViews) * 0.5 +
        (v.viewsPerDay / maxViewsPerDay) * 0.3 +
        (v.engagementRate / maxEngagementRate) * 0.2;

    return {
        ...v,
        engagementRate: Number(v?.engagementRate?.toFixed(2)), // %
        viewsPerDay: Math.round(v?.viewsPerDay),
        smartScore: Number(smartScore?.toFixed(3)),
        isOutlier,
        outlierScore: Number(outlierScore?.toFixed(2)),
    };
    });

        


    return NextResponse.json(finalResult)
}

