FROM node:14

WORKDIR /data

ENV API_PORT = 9097
ENV MONGOIP = 172.17.0.3

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 2002

CMD ["npm", "start"]


#docker run -d --name gamecontainer -p9097:2002 myapiimage
# docker build . -t myapiimage