FROM node:13.12.0-alpine
WORKDIR /app
COPY ReactUI/package.json ./
COPY ReactUI/package-lock.json ./
RUN npm install
COPY ReactUI/ ./
EXPOSE 3000
CMD ["npm", "start"]
