export const config = {
  serverUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : "https://www.yunren.online:14243/",
};
