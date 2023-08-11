const fs = require("fs");
const { listUniversityInformation } = require("./listUniversity");

fs.writeFileSync(
  "./listUniversityInformation.json",
  JSON.stringify(listUniversityInformation)
);
