const http = require("http");
const url = require("url");
const dosenController = require("./controllers/dosenController");

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    const parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname.replace(/\/+$/g, "");
    const method = req.method;
    const query = parsedUrl.query;

    console.log("METHOD:", method, "PATH:", path);

    // GET /dosen
    if (method === "GET" && path === "/dosen") {
        return dosenController.getAll(req, res, query);
    }

    // GET /dosen/:nidn
    if (method === "GET" && path.startsWith("/dosen/")) {
        const nidn = path.split("/")[2];
        return dosenController.getById(req, res, nidn);
    }

    // POST /dosen
    if (method === "POST" && path === "/dosen") {
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
            const data = JSON.parse(body || "{}");
            return dosenController.create(req, res, data);
        });
        return;
    }

    // PUT /dosen/:nidn
    if (method === "PUT" && path.startsWith("/dosen/")) {
        const nidn = path.split("/")[2];
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
            const data = JSON.parse(body || "{}");
            return dosenController.update(req, res, nidn, data);
        });
        return;
    }

    // DELETE /dosen/:nidn
    if (method === "DELETE" && path.startsWith("/dosen/")) {
        const nidn = path.split("/")[2];
        return dosenController.delete(req, res, nidn);
    }

    // ROUTE NOT FOUND
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(9000, () => {
    console.log("HTTP Server running at http://localhost:9000");
});
