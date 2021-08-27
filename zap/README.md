# Zed Attack Proxy Scan
[OWASP® Zed Attack Proxy](https://www.zaproxy.org) is the leading open-source web security vulnerability scanner.  [Docker](https://docs.docker.com) is a prerequisite, allowing us to reduce a large amount of complexity into a single command.

## Geting Started
To scan `node-webservice`, ensure that your service is running in dev mode:
```
cd node-webservice
npm run dev
```

Then, in another console, run the ZAP scan:
```
cd zap
docker-compose up zap-node
```

**NOTE**  If this is your first run, it may take a while to download the initial Docker images.

Your security report will be located at: `zap/report/node-webservice-report.html`
