# syntax=docker/dockerfile:1

# This is a quick fix to host frontend pages under dev env,
# as this project is intented to be run under webkit framework,
# so client-side rounting doesn't handled correctly.
# SPA is generated instead by create-react-app script.
#
# DO NOT USE FOR PRODUCTION.
#
FROM node:14
WORKDIR /app
COPY . .
RUN npm ci
ENV REACT_APP_URL https://bankeesit.feib.com.tw/v2web/app2 
ENV REACT_APP_SM_CTRL_URL https://bankeesit.feib.com.tw/APP2_WebCtrl
ENV BROWSER none
ENV PORT 3006
CMD ["npx", "react-scripts", "start"]
EXPOSE 3006
