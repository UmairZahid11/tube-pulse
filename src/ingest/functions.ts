import { inngest } from "./clients";
import ImageKit from 'imagekit';
import { CreateAiContent, CreatethumbnailPrompt } from "@/app/api/openai";
import Replicate from "replicate";
import { db } from "@/lib/db";
// @ts-ignore
const imageKit = new ImageKit({
  // @ts-ignore  
  publicKey: process.env.IMAGEKIT_PUBLICKEY,
// @ts-ignore
    privateKey: process.env.IMAGEKIT_PRIVATEKEY,
// @ts-ignore
    urlEndpoint: process.env.IMAGEKIT_URLENDPOINT
})

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const GenerateThumbnail = inngest.createFunction(
  { id: "ai/generate-thumbnail" },
  { event: "ai/generate-thumbnail" },
  async ({ event, step }) => {
    
    const { refImage, faceImage, userInput, userId } = await event.data;

    // upload to clound  imagekit
    const uploadImageUrls = await step.run(
      "UploadImage",
      async()=>{
        if(refImage != null){

          const refImageUrl = await imageKit.upload({
            file: refImage?.buffer?? '',
            fileName: refImage?.name ?? 'refImage',
            isPublished: true,
            useUniqueFileName: false,
          });

  
          return refImageUrl.url;
        }else{
          return null
        }
      }
    );

    // create thumbnail prompt
    const thumbnailPrompt = await step.run(
      "GenerateThumbnailPrompt",
      async () => {
        return await CreatethumbnailPrompt(uploadImageUrls, userInput);
      },
    );

    // generate thumbnail using replicate
    const thumbnailImage = await step.run('Generate Image', async () => {
      const input = {
          prompt: thumbnailPrompt,
          aspect_ratio: "16:9",
          output_format: "png",
          safety_filter_level: "block_only_high",
      };
      const output = await replicate.run("google/imagen-4-fast", { input });

      // @ts-ignore
      return output.url();

    })

    // save image to cloud
    const uploadedThumbnail = await step.run(
      "UploadThumbnail",
      async () => {
        const thumbnailUrl = await imageKit.upload({
          file: thumbnailImage,
          fileName: `thumbnail-${Date.now()}.png`,
          isPublished: true,
          useUniqueFileName: false,
        });

        return thumbnailUrl.url;
      },
    );

    // save record to database

    const thumbnailRecord  = await step.run(
      "SaveThumbnailRecord",
      async () => {
        const thumbnailData = {
          userId: userId,
          prompt: thumbnailPrompt,
          imageUrl: uploadedThumbnail,
          createdAt: new Date(),
        };
        try {
          await db.query(
            `INSERT INTO thumbnails
            SET thumbnail_url = ?, prompt = ?, updated_at = CURRENT_TIMESTAMP , userId = ?`,
            [thumbnailData.imageUrl, thumbnailData.prompt, thumbnailData.userId]
          );

          return { success: true, message: "Thumbnail updated", data: thumbnailData };
        } catch (error) {
          console.error("Error updating thumbnail:", error);
           return { success: false, message: "Server error", error };
        }
      },
    )



    return thumbnailRecord;
  },
)

export const generateAiContent = inngest.createFunction(
  { id: "generate-aicontent" },
  { event: "generate-aicontent" },
  async ({ event, step }) => {
    const { userInput, userId } = event.data;

    // 1. Generate content
    const AiContent = await step.run("generate-content", async () => {
      return await CreateAiContent(userInput);
    });

    // 2. Generate image using content
    const imageUrl = await step.run("generate-image", async () => {
      const prompt = (AiContent as any)?.image_prompts?.[0]?.prompt || `Create thumbnail for this input ${userInput}`;
      const input = {
          prompt: prompt,
          aspect_ratio: "16:9",
          output_format: "png",
          safety_filter_level: "block_only_high",
      };
      const output = await replicate.run("google/imagen-4-fast", { input });

      // @ts-ignore
      return output.url();
    });

    // 3. Upload image to ImageKit
    const uploadedThumbnailUrl = await step.run(
      "UploadThumbnail",
      async () => {
        const thumbnailUrl = await imageKit.upload({
          file: imageUrl,
          fileName: `thumbnail-${Date.now()}.png`,
          isPublished: true,
          useUniqueFileName: false,
        });

        return thumbnailUrl.url;
      },
    );

    // 4. Save to DB
    const savedRecord = await step.run("save-to-db", async () => {
      const stringAicontent = JSON.stringify(AiContent);
      await db.query(
        "INSERT INTO ai_content_generator (userId, prompt, content, image_url) VALUES (?, ?, ?, ?)",
        [userId, userInput, stringAicontent, uploadedThumbnailUrl]
      );
      return {userInput, AiContent, imageUrl: uploadedThumbnailUrl };
    });

    // 5. Return data to client
    return savedRecord;
  }
);