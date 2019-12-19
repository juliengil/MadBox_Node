FROM node:13.3.0

# Create app directory
WORKDIR /usr/src/app

# Add existing and declared dependencies
COPY node_scraper/package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY node_scraper/ .

# Run the node script
CMD node scraper.js