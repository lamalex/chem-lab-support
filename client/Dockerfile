# Dockerfile adapted from https://medium.com/greedygame-engineering/so-you-want-to-dockerize-your-react-app-64fbbb74c217

# Build stage 1
FROM node:12 as react-build
WORKDIR /app
copy . ./
RUN yarn
RUN yarn build

# Build stage 2
FROM nginx:alpine
COPY docker.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
