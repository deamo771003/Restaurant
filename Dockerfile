FROM node:16

WORKDIR /usr/src/app

# Install mysql-client
# RUN apt-get update && apt-get install -y default-mysql-client

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 安裝 mysql 模組
RUN apt-get update && \
  apt-get install -y default-mysql-client

# Copy the rest of your application
COPY . .

# Expose the port your app runs on
EXPOSE 80

# Keep your CMD instruction to run the application
CMD [ "node", "app.js" ]
