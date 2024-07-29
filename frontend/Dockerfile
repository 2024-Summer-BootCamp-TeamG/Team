# Step 1: Build the React app
FROM node:20-alpine
WORKDIR /frontend

COPY package.json ./

COPY . ./
RUN npm install
RUN npm run build
# Step 2: Serve the React app with nginx
# FROM nginx:alpine

# COPY --from=build /app/build /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# CMD ["npm", "dev"]





