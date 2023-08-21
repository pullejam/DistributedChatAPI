FROM node:14

WORKDIR /data

# ENV API_PORT = 9097
# ENV MONGOIP = 172.17.0.3
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 2004

CMD ["npm", "start"]
