FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install

RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --production; \
        fi 

COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "run", "dev"]