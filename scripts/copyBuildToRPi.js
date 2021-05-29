const { deploy } = require("sftp-sync-deploy");
const fse = require('fs-extra'); 
require("dotenv").config();

//local copy for github
fse.copy("./build/index.html", "./python/templates/index.html", {overwrite:true}, err => {
    if (err) return console.error(err)
    console.log('success!')
}) 
fse.copy("./build", "./python/static/RvPowerMonitor", {overwrite:true}, err => {
    if (err) return console.error(err)
    console.log('success!')
})

//remote copy to rpi
let config = {
  host: process.env.RPI_IP,
  port: 22,
  username: process.env.RPI_USER,
  password: process.env.RPI_PASSWORD,
  localDir: "./build",
  remoteDir: "/home/pi/RvPowerMonitor/python/static/RvPowerMonitor",
};

let options = {
  dryRun: false, // Enable dry-run mode. Default to false
  exclude: [], // exclude patterns (glob)
  excludeMode: "remove", // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
  forceUpload: false, // Force uploading all files, Default to false(upload only newer files).
};

deploy(config, options)
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error("error! ", err);
  });


//move the index file to the templates folder
config.remoteDir = "/home/pi/RvPowerMonitor/python/templates"
options.exclude = ['!index.html'];
options.excludeMode = 'ignore';

deploy(config, options)
  .then(() => {
    console.log("success!");
  })
  .catch((err) => {
    console.error("error! ", err);
  });