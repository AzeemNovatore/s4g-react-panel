import imageCompression from "browser-image-compression";

export const compressFile = async (file) => {
  try {
    if (!file) return null;
    const options = {
      maxSizeMB: 0.2, //200KB   
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    const fileSize = parseFloat((file.size / 1024 / 1024).toFixed(2));
    console.log(`Selected file size = ${fileSize} mb`);
    if (fileSize < options.maxSizeMB) return file;
    const compressedFile = await imageCompression(file, options);
    console.log(
      `Compressed file size = ${(compressedFile.size / 1024 / 1024).toFixed(
        3
      )} mb`
    );
    return compressedFile;
  } catch (error) {
    console.log(error);
    return null;
  }
};
