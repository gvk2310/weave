FROM node:14.2.0
WORKDIR /
COPY src src
COPY config config
COPY webpack.config.js webpack.config.js
COPY server.js server.js
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY .babelrc .babelrc
RUN npm install
CMD ["sh", "-c", "npm run build && node server.js"]
EXPOSE 3000


