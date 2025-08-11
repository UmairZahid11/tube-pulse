import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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
    const finalResult = videoResultData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail:item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishAt: item.snippet.publishAt,
        viewCount:item.statistics.viewCount,
        likeCount:item.statistics.likeCount,
        commentCount:item.statistics.commentCount,
    }))
        


    return NextResponse.json(finalResult)
}