FROM node:20-alpine

WORKDIR /app

ARG VITE_API_HOST
ENV VITE_API_HOST=$VITE_API_HOST

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]