export const constructor = {
  extractJoiMessage: (input: any) => {
    return input.details[0].message.replace(/['"]+/g, "");
  },
  extractBase64Content: (base64: string) => {
    const splitImage = base64.split(";base64,");
    const contentType = splitImage[0].split(":");
    const fileType = splitImage[0].split("/");

    const result = {
      content_type: contentType[1],
      base64_data: splitImage[1],
      file_extension: fileType[1]
    };

    return result;
  },
  titleCase: (text: string) => {
    const newtext = text.toLowerCase().replace(/(^|\s)(\w)/g, function (x) {
      return x.toUpperCase();
    });
    return newtext;
  },
  duplicateMsg: (str: string) => {
    const regex = /Key \((\w+)\)=\((\w+)\) already exists./;
    const match = regex.exec(str);
    const result = match[1].replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    const substr = "sudah terdaftar";
    return `${result} ${substr}`;
  }
};
