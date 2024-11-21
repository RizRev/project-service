export const common = {
  getTypeMime: (mime: string) => {
    let type = "";
    if (mime === "image/jpg" || mime === "image/jpeg" || mime === "image/png") {
      type = "image";
    } else if (mime === "application/pdf") {
      type = "document";
    }
    return type;
  }
};
