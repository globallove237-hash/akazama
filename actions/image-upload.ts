"use server";

import { cookies } from "next/headers";

interface ImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export async function uploadImageToImgBB(base64Image: string, filename?: string): Promise<{
  success: boolean;
  data?: ImgBBResponse['data'];
  error?: string;
}> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "Clé API ImgBB manquante"
      };
    }

    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', cleanBase64);

    if (filename) {
      formData.append('name', filename);
    }

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result: ImgBBResponse = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        error: "Erreur lors de l'upload sur ImgBB"
      };
    }
  } catch (error) {
    console.error("Erreur upload ImgBB:", error);
    return {
      success: false,
      error: "Erreur lors de l'upload de l'image"
    };
  }
}
