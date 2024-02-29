FROM node:16
WORKDIR /usr/src/app

# Install mysql-client
# RUN apt-get update && apt-get install -y default-mysql-client

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application
COPY . .

# Make sure your init-app.sh script is executable
# RUN chmod +x ./init-app.sh

# This will run your init-app.sh script when the container starts
# ENTRYPOINT ["./init-app.sh"]

# Expose the port your app runs on
EXPOSE 80

# Keep your CMD instruction to run the application
CMD [ "node", "app.js" ]
