import cloudinary from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "../config/env.js";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImage = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      resolve(
        {
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

// const cloudinaryDeleteImage = async (fileToDelete) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.destroy(fileToDelete, (result) => {
//       resolve(
//         {
//           url: result.secure_url,
//           asset_id: result.asset_id,
//           public_id: result.public_id,
//         },
//         {
//           resource_type: "auto",
//         }
//       );
//     });
//   });
// };

// const cloudinaryDeleteImage = (publicId) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.destroy(
//       publicId,
//       { resource_type: "image" },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else if (result.result !== "ok") {
//           reject(new Error(`Cloudinary failed to delete ${publicId}`));
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// };

export { cloudinaryUploadImage};
